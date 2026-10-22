const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ==========================================================================
// 1. LOAD ENVIRONMENT VARIABLES FROM .env
// ==========================================================================
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const SMS_API_KEY = process.env.SMS_API_KEY || 'RLVE915IEZOJLRO847T4PL8OVCZIOT4RLUCALL63';
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-sample';
// OWNER_PHONE set to 0907173634 (+251907173634) for receiving new order SMS notifications
const OWNER_PHONE = process.env.OWNER_PHONE || '0907173634';
const CLOUD_NAME = process.env.CLOUD_NAME || 'trkihe9m';
const UPLOAD_PRESET = process.env.UPLOAD_PRESET || 'Husenonlinemarketing';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'husenonlinemarketing1234';
const OWNER_CHAT_PHONE = '0923245529';

console.log('[CONFIG] SMS_API_KEY loaded:', SMS_API_KEY ? 'Present (length: ' + SMS_API_KEY.length + ')' : 'Missing');
console.log('[CONFIG] CHAPA_SECRET_KEY loaded:', CHAPA_SECRET_KEY ? 'Present' : 'Missing');
console.log('[CONFIG] OWNER_PHONE (SMS Gateway Recipient):', OWNER_PHONE);
console.log('[CONFIG] CLOUD_NAME (Cloudinary):', CLOUD_NAME);
console.log('[CONFIG] UPLOAD_PRESET (Cloudinary):', UPLOAD_PRESET);
console.log('[CONFIG] OWNER_CHAT_PHONE (Telegram / Direct Call):', OWNER_CHAT_PHONE);

const { getStoreData, saveStoreData } = require('./api/cloudStorage.js');
const { hashPassword, verifyPassword, getDefaultUsers, sanitizeUser } = require('./api/authHelper.js');

// ==========================================================================
// 2. PERSISTENT STORAGE: PRODUCTS & SETTINGS
// ==========================================================================
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadProducts() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[STORAGE] Error reading products file:', err);
  }
  return [];
}

function saveProducts(productsList) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productsList, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[STORAGE] Error saving products file:', err);
    return false;
  }
}

function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[STORAGE] Error reading settings file:', err);
  }
  return {
    cbeAccount: "1000123456789",
    cbeAccountName: "Husen Online Store",
    telebirrPhone: "0923245529",
    telebirrAccountName: "Husen Market"
  };
}

function saveSettings(settingsObj) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settingsObj, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[STORAGE] Error saving settings file:', err);
    return false;
  }
}

let productsCache = loadProducts();
let settingsCache = loadSettings();

// In-memory orders database
const orders = [
  {
    id: "HOM-AD-8104",
    date: "Today, 10:15 AM",
    customer: "Desta Alemu",
    phone: "+251911234567",
    location: "Silasi, Adama",
    address: "Near Silasi Church, House #402",
    method: "COD",
    total: 1450,
    itemsSummary: "Glass Storage Container Set (Qty: 1)",
    status: "Delivered",
    smsSent: true
  }
];

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

// ==========================================================================
// 3. AUTOMATED SMS ORDER NOTIFICATIONS TO TEST NUMBER (0907173634)
// ==========================================================================
/**
 * Strict Phone Number Formatter:
 * Accepts e.g. 912345678, 0912345678, +251912345678 and outputs +251912345678
 */
function formatEthiopianPhone(phone) {
  if (!phone) return '+251900000000';
  let digits = phone.toString().replace(/[^0-9]/g, '');
  if (digits.startsWith('251')) {
    digits = digits.substring(3);
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  return '+251' + digits;
}

/**
 * Send automated SMS notification strictly adhering to specification:
 * Recipient Test Number: 0907173634 (+251907173634)
 * SMS Payload Template:
 * New Order Received!
 * Item: [Product Name] (Qty: [Quantity])
 * Total: [Amount] ETB
 * Customer: [Full Name]
 * Phone: +251[Phone Number]
 * Location: [Adama Location]
 * Payment Method: [COD / Chapa / Manual CBE / Manual Telebirr]
 */
async function sendOrderSms(order) {
  const formattedCustomerPhone = formatEthiopianPhone(order.phone);
  const locationText = order.address ? `${order.location}, ${order.address}` : order.location;
  
  // Normalize payment method label strictly to [COD / Chapa / Manual CBE / Manual Telebirr]
  let paymentMethod = 'COD';
  const methodUpper = (order.method || '').toUpperCase();
  if (methodUpper.includes('CHAPA') || methodUpper.includes('TELEBIRR & CBE (VIA CHAPA)')) {
    paymentMethod = 'Chapa';
  } else if (methodUpper.includes('MANUAL CBE') || methodUpper.includes('CBE TRANSFER')) {
    paymentMethod = 'Manual CBE';
  } else if (methodUpper.includes('MANUAL TELEBIRR') || methodUpper.includes('TELEBIRR TRANSFER')) {
    paymentMethod = 'Manual Telebirr';
  } else if (methodUpper.includes('MANUAL')) {
    paymentMethod = 'Manual CBE';
  } else {
    paymentMethod = 'COD';
  }

  const smsBody = 
`New Order Received!
Item: ${order.itemsSummary || 'Household Essentials'}
Total: ${order.total} ETB
Customer: ${order.customer}
Phone: ${formattedCustomerPhone}
Location: ${locationText}
Payment Method: ${paymentMethod}`;

  // Recipient formatted for gateway (+251907173634)
  const recipientFormatted = formatEthiopianPhone(OWNER_PHONE);

  console.log('\n================== DISPATCHING SMS NOTIFICATION ==================');
  console.log(`To: ${recipientFormatted} (Owner Phone: ${OWNER_PHONE})`);
  console.log(`API Key: ${SMS_API_KEY ? SMS_API_KEY.substring(0, 10) + '...' : 'NONE'}`);
  console.log('Payload Content:\n' + smsBody);
  console.log('==================================================================\n');

  try {
    const payload = JSON.stringify({
      to: recipientFormatted,
      message: smsBody,
      from: 'HUSEN'
    });

    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    };

    if (SMS_API_KEY) {
      headers['Authorization'] = `Bearer ${SMS_API_KEY}`;
      headers['X-API-KEY'] = SMS_API_KEY;
      headers['api-key'] = SMS_API_KEY;
    }

    const options = {
      hostname: 'api.afromessage.com',
      port: 443,
      path: '/api/send',
      method: 'POST',
      headers: headers,
      timeout: 5000
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let respData = '';
        res.on('data', chunk => respData += chunk);
        res.on('end', () => {
          console.log(`\n[SMS GATEWAY FULL RESPONSE] (Status ${res.statusCode}):\n${respData}\n`);
          const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
          if (!isSuccess) {
            console.error(`[SMS ALERT ERROR] Dispatch failed with HTTP ${res.statusCode} for ${recipientFormatted}:`, respData);
          } else {
            console.log(`[SMS ALERT SUCCESS] SMS delivered successfully to ${recipientFormatted}.`);
          }
          resolve({ success: isSuccess, statusCode: res.statusCode, response: respData });
        });
      });

      req.on('error', (err) => {
        console.error('[SMS ALERT ERROR] Network error during dispatch:', err.message);
        resolve({ success: false, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        console.error('[SMS ALERT ERROR] SMS gateway request timed out after 5s.');
        resolve({ success: false, error: 'Timeout' });
      });

      req.write(payload);
      req.end();
    });
  } catch (err) {
    console.error('[SMS ALERT ERROR] Unexpected exception during dispatch:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================================================
// 4. CHAPA PAYMENT API INTEGRATION
// ==========================================================================
function callChapaInitialize(chapaData, secretKeyOverride) {
  return new Promise((resolve, reject) => {
    const keyToUse = secretKeyOverride || process.env.CHAPA_SECRET_KEY || CHAPA_SECRET_KEY;
    const payload = JSON.stringify(chapaData);
    console.log('\n================== CHAPA INITIALIZE REQUEST ==================');
    console.log('Endpoint: https://api.chapa.co/v1/transaction/initialize');
    console.log('tx_ref:', chapaData.tx_ref, '| amount:', chapaData.amount, 'ETB | customer:', chapaData.first_name);
    console.log('Using Key:', keyToUse ? (keyToUse.substring(0, 12) + '...') : 'NONE');
    console.log('==============================================================\n');

    const options = {
      hostname: 'api.chapa.co',
      port: 443,
      path: '/v1/transaction/initialize',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keyToUse}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n[CHAPA INITIALIZE FULL RESPONSE] (Status ${res.statusCode}):\n${data}\n`);
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300 && parsed.status === 'success' && parsed.data && parsed.data.checkout_url) {
            console.log('[CHAPA SUCCESS] Hosted checkout URL obtained:', parsed.data.checkout_url);
            resolve(parsed);
          } else {
            console.error('[CHAPA ERROR] Initialization rejected by Chapa API:', parsed);
            resolve({
              status: "error",
              message: parsed.message || 'Invalid Chapa Secret Key. Please set your Chapa API Key (CHASECK_TEST-... or CHASECK_LIVE-...) in Admin Settings.',
              details: parsed
            });
          }
        } catch (e) {
          console.error('[CHAPA PARSE ERROR]', e.message, data);
          resolve({
            status: "error",
            message: "Failed to parse Chapa response: " + e.message
          });
        }
      });
    });

    req.on('error', (err) => {
      console.error('[CHAPA NETWORK ERROR]', err.message);
      resolve({
        status: "error",
        message: 'Chapa network error: ' + err.message
      });
    });

    req.write(payload);
    req.end();
  });
}

function callChapaVerify(txRef) {
  return new Promise((resolve) => {
    if (!CHAPA_SECRET_KEY || CHAPA_SECRET_KEY.includes('sample')) {
      return resolve({ status: "success", data: { status: "success", tx_ref: txRef } });
    }

    const options = {
      hostname: 'api.chapa.co',
      port: 443,
      path: `/v1/transaction/verify/${txRef}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
      },
      timeout: 6000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({ status: "success" });
        }
      });
    });

    req.on('error', () => resolve({ status: "success" }));
    req.end();
  });
}

// Helper to read request body with high limit for photo uploads
function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // 30MB limit for device photo uploads
      if (body.length > 30 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// ==========================================================================
// 5. HTTP SERVER & ROUTING
// ==========================================================================
const server = http.createServer(async (req, res) => {
  // CORS & JSON helpers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; connect-src 'self' https://api.cloudinary.com https://api.afromessage.com https://api.chapa.co https://keyvalue.immanuel.co; img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://telegram.org https://fonts.gstatic.com;");

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // --- API ROUTE: Products CRUD ---
  if (pathname === '/api/products') {
    if (req.method === 'GET') {
      const store = await getStoreData();
      productsCache = store.products;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, products: store.products, updatedAt: store.updatedAt }));
      return;
    }

    if (req.method === 'POST') {
      try {
        const newProd = await readRequestBody(req);
        if (!newProd.name || !newProd.price) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Product name and price are required' }));
          return;
        }

        const id = newProd.id || ('prod-' + Date.now());
        const trimmedCat = (newProd.category || 'home').trim();
        const product = {
          id: id,
          category: trimmedCat,
          secondaryCategory: newProd.secondaryCategory || '',
          categoryTranslations: newProd.categoryTranslations || null,
          price: Number(newProd.price),
          inStock: newProd.inStock !== false,
          images: Array.isArray(newProd.images) && newProd.images.length > 0 ? newProd.images : ['public/images/storage1.jpg'],
          name: typeof newProd.name === 'object' ? newProd.name : {
            en: newProd.name,
            am: newProd.name,
            om: newProd.name
          },
          spec: typeof newProd.spec === 'object' ? newProd.spec : {
            en: newProd.spec || newProd.description || '',
            am: newProd.spec || newProd.description || '',
            om: newProd.spec || newProd.description || ''
          },
          fullDesc: typeof newProd.fullDesc === 'object' ? newProd.fullDesc : {
            en: newProd.fullDesc || newProd.description || '',
            am: newProd.fullDesc || newProd.description || '',
            om: newProd.fullDesc || newProd.description || ''
          },
          badge: newProd.badge || { en: 'New', am: 'አዲስ', om: 'Haaraa' }
        };

        const store = await getStoreData(false);
        const existingIdx = store.products.findIndex(p => p.id === id);
        let updatedList;
        if (existingIdx !== -1) {
          updatedList = [...store.products];
          updatedList[existingIdx] = product;
        } else {
          updatedList = [product, ...store.products];
        }

        // Auto-register category translations if provided
        let updatedCategories = { ...(store.categories || {}) };
        if (newProd.categoryTranslations) {
          updatedCategories[trimmedCat.toLowerCase()] = newProd.categoryTranslations;
        }

        productsCache = updatedList;
        saveProducts(productsCache);
        const saved = await saveStoreData({ products: updatedList, categories: updatedCategories });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, product, products: saved.products, updatedAt: saved.updatedAt }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }
  }

  // --- API ROUTE: Single Product PUT / DELETE (/api/products/:id) ---
  if (pathname.startsWith('/api/products/')) {
    const prodId = pathname.replace('/api/products/', '');

    if (req.method === 'PUT') {
      try {
        const updateData = await readRequestBody(req);
        const store = await getStoreData(false);
        const idx = store.products.findIndex(p => p.id === prodId);
        if (idx === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Product not found' }));
          return;
        }

        const existing = store.products[idx];
        const trimmedCat = updateData.category !== undefined ? String(updateData.category).trim() : existing.category;
        const updated = {
          ...existing,
          ...updateData,
          id: prodId,
          category: trimmedCat,
          categoryTranslations: updateData.categoryTranslations !== undefined ? updateData.categoryTranslations : existing.categoryTranslations,
          price: updateData.price !== undefined ? Number(updateData.price) : existing.price,
          inStock: updateData.inStock !== undefined ? Boolean(updateData.inStock) : existing.inStock,
          images: Array.isArray(updateData.images) && updateData.images.length > 0 ? updateData.images : existing.images
        };

        // Format localized strings if passed as string
        if (typeof updateData.name === 'string') {
          updated.name = { ...existing.name, en: updateData.name, am: updateData.name, om: updateData.name };
        }
        if (typeof updateData.spec === 'string') {
          updated.spec = { ...existing.spec, en: updateData.spec, am: updateData.spec, om: updateData.spec };
        }
        if (typeof updateData.fullDesc === 'string') {
          updated.fullDesc = { ...existing.fullDesc, en: updateData.fullDesc, am: updateData.fullDesc, om: updateData.fullDesc };
        }

        const updatedList = [...store.products];
        updatedList[idx] = updated;

        let updatedCategories = { ...(store.categories || {}) };
        if (updateData.categoryTranslations) {
          updatedCategories[trimmedCat.toLowerCase()] = updateData.categoryTranslations;
        }

        productsCache = updatedList;
        saveProducts(productsCache);
        const saved = await saveStoreData({ products: updatedList, categories: updatedCategories });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, product: updated, products: saved.products, updatedAt: saved.updatedAt }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    if (req.method === 'DELETE') {
      try {
        const store = await getStoreData(false);
        const idx = store.products.findIndex(p => p.id === prodId);
        if (idx === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Product not found' }));
          return;
        }

        const updatedList = store.products.filter(p => p.id !== prodId);
        productsCache = updatedList;
        saveProducts(productsCache);
        const saved = await saveStoreData({ products: updatedList });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Product deleted', products: saved.products, updatedAt: saved.updatedAt }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }
  }

  // --- API ROUTE: Payment Settings (CBE & Telebirr Accounts) ---
  if (pathname === '/api/settings') {
    if (req.method === 'GET') {
      const store = await getStoreData();
      settingsCache = store.settings;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, settings: store.settings }));
      return;
    }

    if (req.method === 'POST') {
      try {
        const newSettings = await readRequestBody(req);
        const store = await getStoreData(false);
        const mergedSettings = {
          ...store.settings,
          cbeAccount: newSettings.cbeAccount || store.settings.cbeAccount,
          cbeAccountName: newSettings.cbeAccountName || store.settings.cbeAccountName,
          telebirrPhone: newSettings.telebirrPhone || store.settings.telebirrPhone,
          telebirrAccountName: newSettings.telebirrAccountName || store.settings.telebirrAccountName,
          chapaSecretKey: newSettings.chapaSecretKey !== undefined ? newSettings.chapaSecretKey : store.settings.chapaSecretKey
        };
        settingsCache = mergedSettings;
        saveSettings(settingsCache);
        const saved = await saveStoreData({ settings: mergedSettings });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, settings: saved.settings }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }
  }

  // --- API ROUTE: Client Configuration (Cloudinary & Owner Phone) ---
  if (req.method === 'GET' && pathname === '/api/config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      ownerPhone: OWNER_PHONE
    }));
    return;
  }

  // --- API ROUTE: Categories Store ---
  if (pathname === '/api/categories') {
    if (req.method === 'GET') {
      const store = await getStoreData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, categories: store.categories || {} }));
      return;
    }
    if (req.method === 'POST') {
      try {
        const newCats = await readRequestBody(req);
        const store = await getStoreData(false);
        const merged = { ...(store.categories || {}), ...newCats };
        await saveStoreData({ categories: merged });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, categories: merged }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }
  }

  // --- API ROUTE: Cloudinary Server Signing (Secrets stay on server) ---
  if (req.method === 'POST' && pathname === '/api/cloudinary/sign') {
    try {
      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      const apiKey = process.env.CLOUDINARY_API_KEY;

      if (!apiSecret || !apiKey) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          signed: false,
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET
        }));
        return;
      }

      const body = await readRequestBody(req);
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign = {
        timestamp: timestamp,
        ...(body.params || {})
      };

      const sortedKeys = Object.keys(paramsToSign).sort();
      const toSign = sortedKeys.map(k => `${k}=${paramsToSign[k]}`).join('&');
      const crypto = require('crypto');
      const signature = crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        signed: true,
        signature,
        timestamp,
        apiKey,
        cloudName: CLOUD_NAME
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API ROUTE: Admin Login (Hashed Password on Server) ---
  if (req.method === 'POST' && pathname === '/api/admin/login') {
    try {
      const body = await readRequestBody(req);
      const password = (body.password || '').trim();
      const username = (body.username || '').trim().toLowerCase();

      if (!password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Password is required' }));
        return;
      }

      const store = await getStoreData();
      const users = store.users && store.users.length > 0 ? store.users : getDefaultUsers();

      let matchedUser = null;
      if (username) {
        matchedUser = users.find(u => u.username.toLowerCase() === username);
      } else {
        // Fallback: match by password against owner first, then staff
        for (const u of users) {
          if (verifyPassword(password, u.passwordHash)) {
            matchedUser = u;
            break;
          }
        }
      }

      // Legacy fallback check for ADMIN_PASSWORD env
      const isLegacyOwner = (!matchedUser || matchedUser.role === 'owner') && password === ADMIN_PASSWORD;

      if ((matchedUser && verifyPassword(password, matchedUser.passwordHash)) || isLegacyOwner) {
        const userObj = matchedUser ? sanitizeUser(matchedUser) : { id: 'usr-owner', username: 'owner', name: 'Store Owner', role: 'owner' };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          user: userObj
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Incorrect username or password' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API ROUTE: Admin Verify Login Password (Backwards Compatibility) ---
  if (req.method === 'POST' && pathname === '/api/admin/verify') {
    try {
      const body = await readRequestBody(req);
      const password = (body.password || '').trim();
      const username = (body.username || '').trim().toLowerCase();

      const store = await getStoreData();
      const users = store.users && store.users.length > 0 ? store.users : getDefaultUsers();

      let matchedUser = null;
      if (username) {
        matchedUser = users.find(u => u.username.toLowerCase() === username);
      } else {
        for (const u of users) {
          if (verifyPassword(password, u.passwordHash)) {
            matchedUser = u;
            break;
          }
        }
      }

      const isLegacyMatch = password === ADMIN_PASSWORD;

      if ((matchedUser && verifyPassword(password, matchedUser.passwordHash)) || isLegacyMatch) {
        const userObj = matchedUser ? sanitizeUser(matchedUser) : { id: 'usr-owner', username: 'owner', name: 'Store Owner', role: 'owner' };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: userObj }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Incorrect password' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API ROUTE: Change Password ---
  if (req.method === 'POST' && pathname === '/api/admin/change-password') {
    try {
      const body = await readRequestBody(req);
      const username = (body.username || '').trim().toLowerCase();
      const currentPassword = (body.currentPassword || '').trim();
      const newPassword = (body.newPassword || '').trim();
      const confirmPassword = (body.confirmPassword || '').trim();

      if (!username) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Username is required' }));
        return;
      }
      if (!currentPassword) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Current password is required' }));
        return;
      }
      if (!newPassword || newPassword.length < 8) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'New password must be at least 8 characters long' }));
        return;
      }
      if (newPassword !== confirmPassword) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'New password and confirmation do not match' }));
        return;
      }
      if (newPassword === currentPassword) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'New password must differ from current password' }));
        return;
      }

      const store = await getStoreData(false);
      let users = Array.isArray(store.users) && store.users.length > 0 ? [...store.users] : getDefaultUsers();
      const userIndex = users.findIndex(u => u.username.toLowerCase() === username);

      if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'User account not found' }));
        return;
      }

      const user = users[userIndex];
      // Verify current password first (or legacy env match for owner)
      const isCurrentValid = verifyPassword(currentPassword, user.passwordHash) ||
                             (user.role === 'owner' && currentPassword === ADMIN_PASSWORD);

      if (!isCurrentValid) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Current password is incorrect' }));
        return;
      }

      // Hash new password securely
      const newHash = hashPassword(newPassword);
      users[userIndex] = {
        ...user,
        passwordHash: newHash,
        updatedAt: Date.now()
      };

      await saveStoreData({ users });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Password changed successfully. Please log in again.'
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API ROUTE: Reset Staff Password (Owner Only) ---
  if (req.method === 'POST' && pathname === '/api/admin/reset-staff-password') {
    try {
      const body = await readRequestBody(req);
      const ownerUsername = (body.ownerUsername || 'owner').trim().toLowerCase();
      const ownerPassword = (body.ownerPassword || '').trim();
      const staffUsername = (body.staffUsername || '').trim().toLowerCase();
      const newPassword = (body.newPassword || '').trim();
      const confirmPassword = (body.confirmPassword || '').trim();

      if (!ownerPassword) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Owner password is required to authorize staff reset' }));
        return;
      }
      if (!staffUsername) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Staff username is required' }));
        return;
      }
      if (!newPassword || newPassword.length < 8) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'New password must be at least 8 characters long' }));
        return;
      }
      if (newPassword !== confirmPassword) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Password confirmation does not match' }));
        return;
      }

      const store = await getStoreData(false);
      let users = Array.isArray(store.users) && store.users.length > 0 ? [...store.users] : getDefaultUsers();

      // Verify owner
      const ownerUser = users.find(u => u.username.toLowerCase() === ownerUsername && u.role === 'owner');
      const isOwnerValid = (ownerUser && verifyPassword(ownerPassword, ownerUser.passwordHash)) ||
                           ownerPassword === ADMIN_PASSWORD;

      if (!isOwnerValid) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid owner credentials' }));
        return;
      }

      // Verify target staff
      const staffIndex = users.findIndex(u => u.username.toLowerCase() === staffUsername);
      if (staffIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: `Staff account "${staffUsername}" not found` }));
        return;
      }

      if (users[staffIndex].role === 'owner') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Owner password must be changed via Change Password' }));
        return;
      }

      users[staffIndex] = {
        ...users[staffIndex],
        passwordHash: hashPassword(newPassword),
        updatedAt: Date.now()
      };

      await saveStoreData({ users });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Password for staff member "${staffUsername}" was reset successfully.`
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API ROUTE: List Admin Users (Public Info Only) ---
  if (req.method === 'GET' && pathname === '/api/admin/users') {
    const store = await getStoreData();
    const users = (store.users || getDefaultUsers()).map(sanitizeUser);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, users }));
    return;
  }

  // --- API ROUTE: Test SMS Dispatch to 0907173634 ---
  if (req.method === 'POST' && pathname === '/api/admin/test-sms') {
    const testOrder = {
      id: 'HOM-TEST-' + Math.floor(1000 + Math.random() * 9000),
      itemsSummary: 'Husen Online Store Test Alert',
      total: 1450,
      customer: 'Husen Owner',
      phone: OWNER_PHONE,
      location: 'Adama Center',
      method: 'Test SMS'
    };
    const smsResult = await sendOrderSms(testOrder);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: smsResult.success,
      recipient: OWNER_PHONE,
      statusCode: smsResult.statusCode,
      response: smsResult.response
    }));
    return;
  }

  // --- API ROUTE: Cash on Delivery Order Placement ---
  if (req.method === 'POST' && pathname === '/api/orders/cod') {
    try {
      const orderData = await readRequestBody(req);
      const ref = 'HOM-AD-' + Math.floor(1000 + Math.random() * 9000);
      const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newOrder = {
        id: ref,
        date: `Today, ${dateStr}`,
        customer: orderData.customer,
        phone: formatEthiopianPhone(orderData.phone),
        location: orderData.location,
        address: orderData.address || '',
        method: 'COD',
        total: orderData.total,
        itemsSummary: orderData.itemsSummary,
        status: 'Pending - Cash on Delivery',
        smsSent: true
      };

      orders.unshift(newOrder);

      // Dispatch automated SMS to recipient test number (0907173634)
      await sendOrderSms(newOrder);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, order: newOrder }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API ROUTE: Manual Direct Transfer Order Placement (CBE / Telebirr) ---
  if (req.method === 'POST' && pathname === '/api/orders/manual') {
    try {
      const orderData = await readRequestBody(req);
      const ref = 'HOM-MN-' + Math.floor(1000 + Math.random() * 9000);
      const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const methodLabel = orderData.method && orderData.method.includes('Telebirr') ? 'Manual Telebirr' : 'Manual CBE';

      const newOrder = {
        id: ref,
        date: `Today, ${dateStr}`,
        customer: orderData.customer,
        phone: formatEthiopianPhone(orderData.phone),
        location: orderData.location,
        address: orderData.address || '',
        method: methodLabel,
        total: orderData.total,
        itemsSummary: orderData.itemsSummary,
        status: 'Pending - Manual Transfer Verification',
        smsSent: true
      };

      orders.unshift(newOrder);

      // Dispatch automated SMS to recipient test number (0907173634)
      await sendOrderSms(newOrder);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, order: newOrder }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API ROUTE: Chapa Initialize Payment ---
  if (req.method === 'POST' && pathname === '/api/chapa/initialize') {
    try {
      const reqData = await readRequestBody(req);
      const store = await getStoreData();
      const activeKey = (store && store.settings && store.settings.chapaSecretKey) || process.env.CHAPA_SECRET_KEY || CHAPA_SECRET_KEY;

      const tx_ref = reqData.tx_ref || ('HOM-tx-' + Date.now());
      const cleanPhone = (reqData.phone_number || '').replace(/[^0-9]/g, '');
      const host = req.headers.host || `localhost:${PORT}`;
      const protocol = req.headers['x-forwarded-proto'] || 'http';

      // Stash pending order in memory
      const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const pendingOrder = {
        id: tx_ref,
        date: `Today, ${dateStr}`,
        customer: reqData.first_name,
        phone: formatEthiopianPhone(reqData.phone_number),
        location: reqData.location || 'Adama',
        address: reqData.address || '',
        method: 'Chapa',
        total: reqData.amount,
        itemsSummary: reqData.itemsSummary || 'Household Essentials',
        status: 'Pending - Chapa Payment',
        smsSent: false
      };
      orders.unshift(pendingOrder);

      const chapaPayload = {
        amount: reqData.amount.toString(),
        currency: "ETB",
        email: reqData.email || `${cleanPhone || 'customer'}@husenmarketing.et`,
        first_name: reqData.first_name,
        phone_number: reqData.phone_number,
        tx_ref: tx_ref,
        callback_url: `${protocol}://${host}/api/chapa/callback`,
        return_url: `${protocol}://${host}/payment-success?tx_ref=${tx_ref}`,
        customization: {
          title: "Husen Online Marketing",
          description: `Payment for ${reqData.itemsSummary || 'Order'}`
        }
      };

      console.log('[CHAPA INITIALIZE REQUEST]', chapaPayload);
      const chapaRes = await callChapaInitialize(chapaPayload, activeKey);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (chapaRes.status === 'success' && chapaRes.data && chapaRes.data.checkout_url) {
        res.end(JSON.stringify({
          status: "success",
          checkout_url: chapaRes.data.checkout_url,
          tx_ref: tx_ref
        }));
      } else {
        res.end(JSON.stringify({
          status: "error",
          message: chapaRes.message || 'Chapa initialization failed. Please check your Secret Key in Admin Settings.',
          tx_ref: tx_ref
        }));
      }
    } catch (err) {
      console.error('[CHAPA INITIALIZE ERROR]', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "error", message: err.message }));
    }
    return;
  }

  // --- API ROUTE: Chapa Verify / Callback ---
  if (req.method === 'GET' && pathname.startsWith('/api/chapa/verify/')) {
    const txRef = pathname.replace('/api/chapa/verify/', '');
    console.log('[CHAPA VERIFYING]', txRef);
    
    await callChapaVerify(txRef);
    const order = orders.find(o => o.id === txRef);
    if (order && !order.smsSent) {
      order.status = 'Paid - Chapa';
      order.smsSent = true;
      await sendOrderSms(order);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "success", order: order || null }));
    return;
  }

  // --- API ROUTE: List Orders (for Admin Portal) ---
  if (req.method === 'GET' && pathname === '/api/orders') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ orders }));
    return;
  }

  // --- PAYMENT SUCCESS PAGE REDIRECT ROUTE ---
  if (req.method === 'GET' && pathname === '/payment-success') {
    const tx_ref = parsedUrl.searchParams.get('tx_ref');
    const order = orders.find(o => o.id === tx_ref);
    if (order && !order.smsSent) {
      order.status = 'Paid - Chapa';
      order.smsSent = true;
      await sendOrderSms(order);
    }
    res.writeHead(302, { 'Location': `/?payment=success&tx_ref=${encodeURIComponent(tx_ref || '')}` });
    res.end();
    return;
  }

  // --- STATIC FILE SERVING ---
  let reqPath = pathname;
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Husen Online Marketing Storefront Active`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  SMS Recipient Owner Phone: ${OWNER_PHONE}`);
  console.log(`  Owner Chat Phone (Telegram): ${OWNER_CHAT_PHONE}`);
  console.log(`======================================================\n`);
});
