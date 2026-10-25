/**
 * HUSEN ONLINE MARKETING — Supabase Postgres Production Data Engine
 * Permanent cloud database layer for products, categories, orders, admin accounts, and audit logs.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. SUPABASE CREDENTIALS (from Environment Variables with fallbacks)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hhkaotnpohmkklbobplh.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoa2FvdG5wb2hta2tsYm9icGxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjkxNjU5MCwiZXhwIjoyMTA4NDkyNTkwfQ.cU8TF5_eir7DEn6mBQhrxVueCZlW9VgQn6uE-LpdvWs';

const LOCAL_PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');
const LOCAL_SETTINGS_FILE = path.join(__dirname, '..', 'data', 'settings.json');
const LOCAL_LOGS_FILE = path.join(__dirname, '..', 'data', 'activity_logs.json');

// In-memory fallback stores
let fallbackActivityLogs = [];
try {
  if (fs.existsSync(LOCAL_LOGS_FILE)) {
    fallbackActivityLogs = JSON.parse(fs.readFileSync(LOCAL_LOGS_FILE, 'utf8'));
  }
} catch (e) {}

// Helper: Parse Supabase Hostname and Base Path
function getSupabaseConfig() {
  try {
    const parsed = new URL(SUPABASE_URL);
    return {
      hostname: parsed.hostname,
      basePath: parsed.pathname.replace(/\/$/, '')
    };
  } catch (e) {
    return {
      hostname: 'hhkaotnpohmkklbobplh.supabase.co',
      basePath: ''
    };
  }
}

// 2. HTTPS Request Wrapper for Supabase PostgREST
function supabaseRequest(endpoint, { method = 'GET', body = null, headers = {} } = {}) {
  const { hostname, basePath } = getSupabaseConfig();
  const fullPath = `${basePath}/rest/v1/${endpoint}`;

  return new Promise((resolve, reject) => {
    const reqHeaders = {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Accept': 'application/json',
      ...headers
    };

    let reqBodyStr = null;
    if (body) {
      reqBodyStr = JSON.stringify(body);
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(reqBodyStr);
    }

    const options = {
      hostname,
      port: 443,
      path: fullPath,
      method,
      headers: reqHeaders,
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          if (data) parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } else {
          const err = new Error(parsed && parsed.message ? parsed.message : `Supabase error (${res.statusCode}): ${data}`);
          err.statusCode = res.statusCode;
          err.details = parsed;
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Supabase request timed out'));
    });

    if (reqBodyStr) req.write(reqBodyStr);
    req.end();
  });
}

// Helper: Sanitize Image URL List
function sanitizeImageUrls(images) {
  if (!Array.isArray(images)) return [];
  return images.map(img => {
    if (!img) return null;
    let url = '';
    if (typeof img === 'object' && img.secure_url) {
      url = img.secure_url;
    } else if (typeof img === 'string') {
      url = img.trim();
    }
    // Reject data:, blob:, or relative files if they do not start with http or local fallback
    if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
      return null;
    }
    return url;
  }).filter(Boolean);
}

// 3. Fallback Initial Catalog
function loadLocalFallbackProducts() {
  try {
    if (fs.existsSync(LOCAL_PRODUCTS_FILE)) {
      const raw = fs.readFileSync(LOCAL_PRODUCTS_FILE, 'utf8');
      const items = JSON.parse(raw);
      if (Array.isArray(items) && items.length > 0) {
        return items.map(formatProductRecord);
      }
    }
  } catch (e) {}
  return [];
}

// Format DB product record to clean client-ready product object
function formatProductRecord(row) {
  if (!row) return null;

  // Name object: { en, am, om }
  let nameObj = row.name;
  if (typeof nameObj === 'string') {
    nameObj = { en: nameObj, am: nameObj, om: nameObj };
  } else if (!nameObj || typeof nameObj !== 'object') {
    nameObj = { en: 'Product', am: 'ምርት', om: 'Meeshaa' };
  }

  // Description object: { en, am, om }
  let descObj = row.description;
  if (typeof descObj === 'string') {
    descObj = { en: descObj, am: descObj, om: descObj };
  } else if (!descObj || typeof descObj !== 'object') {
    descObj = { en: '', am: '', om: '' };
  }

  // Clean images array strictly to array of strings
  const cleanImages = sanitizeImageUrls(row.images);

  return {
    id: row.id,
    name: nameObj,
    spec: descObj,
    fullDesc: descObj,
    price: Number(row.price) || 0,
    category: row.category || 'general',
    secondaryCategory: row.secondary_category || row.secondaryCategory || '',
    images: cleanImages.length > 0 ? cleanImages : ['public/images/storage1.jpg'],
    imagePublicIds: row.image_public_ids || [],
    inStock: row.in_stock !== false && row.inStock !== false,
    sortOrder: Number(row.sort_order) || 0,
    badge: row.badge || null,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

// ==========================================================================
// 4. DATABASE OPERATIONS
// ==========================================================================

/**
 * Save products to local mirror file (safe fallback)
 */
function mirrorProductsToLocal(productsList) {
  try {
    fs.writeFileSync(LOCAL_PRODUCTS_FILE, JSON.stringify(productsList, null, 2), 'utf8');
  } catch (e) {}
}

/**
 * Log activity for store owner audit trail
 */
async function logActivity(actor, action, target, details = {}) {
  const entry = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    actor: actor || 'admin',
    action,
    target: target || '',
    details: typeof details === 'object' ? details : { info: details },
    created_at: new Date().toISOString()
  };

  // Keep in fallback memory
  fallbackActivityLogs.unshift(entry);
  if (fallbackActivityLogs.length > 200) fallbackActivityLogs = fallbackActivityLogs.slice(0, 200);
  try {
    fs.writeFileSync(LOCAL_LOGS_FILE, JSON.stringify(fallbackActivityLogs, null, 2), 'utf8');
  } catch (e) {}

  try {
    await supabaseRequest('activity_logs', {
      method: 'POST',
      body: [{
        actor: entry.actor,
        action: entry.action,
        target: entry.target,
        details: entry.details,
        created_at: entry.created_at
      }]
    });
  } catch (e) {
    // Non-blocking log failure
  }
}

/**
 * Get all activity logs
 */
async function getActivityLogs(limit = 100) {
  try {
    const res = await supabaseRequest(`activity_logs?select=*&order=created_at.desc&limit=${limit}`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (e) {}
  return fallbackActivityLogs.slice(0, limit);
}

/**
 * Ensure category exists in categories table
 */
async function ensureCategory(categoryName, langData = null) {
  if (!categoryName) return;
  const slug = categoryName.trim().toLowerCase();
  try {
    const nameObj = langData || { en: categoryName, am: categoryName, om: categoryName };
    await supabaseRequest('categories', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates' },
      body: [{
        id: slug,
        name: nameObj,
        created_at: new Date().toISOString()
      }]
    });
  } catch (e) {
    // Non-blocking
  }
}

/**
 * Fetch all products from Supabase
 */
async function getProducts({ includeOutOfStock = true } = {}) {
  try {
    let query = 'products?select=*&order=sort_order.asc,created_at.desc';
    if (!includeOutOfStock) {
      query += '&in_stock=eq.true';
    }
    const res = await supabaseRequest(query);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map(formatProductRecord);
    }
  } catch (err) {
    console.warn('[DB] Supabase getProducts fetch error (falling back to local cache):', err.message);
  }
  return loadLocalFallbackProducts();
}

/**
 * Fetch a single product by ID
 */
async function getProductById(id) {
  try {
    const res = await supabaseRequest(`products?id=eq.${encodeURIComponent(id)}&limit=1`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return formatProductRecord(res.data[0]);
    }
  } catch (e) {}
  const local = loadLocalFallbackProducts();
  return local.find(p => p.id === id) || null;
}

/**
 * Create a new product in Supabase
 */
async function createProduct(prodData, actor = 'owner') {
  const id = prodData.id || `prod-${Date.now()}`;
  const cleanImages = sanitizeImageUrls(prodData.images);

  if (cleanImages.length === 0) {
    throw new Error('Product must have at least one valid photo URL.');
  }

  const nameObj = typeof prodData.name === 'object' ? prodData.name : { en: prodData.name, am: prodData.name, om: prodData.name };
  const descObj = typeof prodData.spec === 'object' ? prodData.spec : (typeof prodData.fullDesc === 'object' ? prodData.fullDesc : { en: prodData.spec || '', am: prodData.spec || '', om: prodData.spec || '' });

  const record = {
    id,
    name: nameObj,
    description: descObj,
    price: Math.max(0, parseInt(prodData.price, 10) || 0),
    category: (prodData.category || 'general').trim(),
    secondary_category: (prodData.secondaryCategory || '').trim(),
    images: cleanImages,
    image_public_ids: Array.isArray(prodData.imagePublicIds) ? prodData.imagePublicIds : [],
    in_stock: prodData.inStock !== false,
    sort_order: parseInt(prodData.sortOrder, 10) || 0,
    badge: prodData.badge || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  let createdRecord = formatProductRecord(record);
  try {
    const res = await supabaseRequest('products', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: [record]
    });
    if (Array.isArray(res.data) && res.data[0]) {
      createdRecord = formatProductRecord(res.data[0]);
    }
  } catch (err) {
    console.warn('[DB] Supabase create error (mirroring to fallback):', err.message);
  }

  // Synchronously update local fallback
  const localList = loadLocalFallbackProducts();
  const existingIdx = localList.findIndex(p => String(p.id) === String(id));
  if (existingIdx !== -1) {
    localList[existingIdx] = createdRecord;
  } else {
    localList.unshift(createdRecord);
  }
  mirrorProductsToLocal(localList);

  // Auto-record category & audit log
  await ensureCategory(record.category, prodData.categoryTranslations);
  await logActivity(actor, 'CREATE_PRODUCT', id, { name: nameObj.en || nameObj.am, price: record.price });

  return createdRecord;
}

/**
 * Update an existing product in Supabase
 */
async function updateProduct(id, prodData, actor = 'owner') {
  const updates = {
    updated_at: new Date().toISOString()
  };

  if (prodData.name) {
    updates.name = typeof prodData.name === 'object' ? prodData.name : { en: prodData.name, am: prodData.name, om: prodData.name };
  }
  if (prodData.spec || prodData.fullDesc || prodData.description) {
    const d = prodData.description || prodData.fullDesc || prodData.spec;
    updates.description = typeof d === 'object' ? d : { en: d, am: d, om: d };
  }
  if (prodData.price !== undefined) {
    updates.price = Math.max(0, parseInt(prodData.price, 10) || 0);
  }
  if (prodData.category !== undefined) {
    updates.category = (prodData.category || 'general').trim();
    await ensureCategory(updates.category, prodData.categoryTranslations);
  }
  if (prodData.secondaryCategory !== undefined) {
    updates.secondary_category = (prodData.secondaryCategory || '').trim();
  }
  if (prodData.images !== undefined) {
    const cleanImgs = sanitizeImageUrls(prodData.images);
    if (cleanImgs.length > 0) {
      updates.images = cleanImgs;
    }
  }
  if (prodData.imagePublicIds !== undefined) {
    updates.image_public_ids = prodData.imagePublicIds;
  }
  if (prodData.inStock !== undefined) {
    updates.in_stock = Boolean(prodData.inStock);
  }
  if (prodData.sortOrder !== undefined) {
    updates.sort_order = parseInt(prodData.sortOrder, 10) || 0;
  }
  if (prodData.badge !== undefined) {
    updates.badge = prodData.badge;
  }

  let updatedRecord = null;
  try {
    const res = await supabaseRequest(`products?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: updates
    });
    if (Array.isArray(res.data) && res.data[0]) {
      updatedRecord = formatProductRecord(res.data[0]);
    }
  } catch (err) {
    console.warn('[DB] Supabase update error (mirroring to fallback):', err.message);
  }

  // Update local fallback
  const localList = loadLocalFallbackProducts();
  const idx = localList.findIndex(p => String(p.id) === String(id));
  if (idx !== -1) {
    localList[idx] = { ...localList[idx], ...updates, inStock: updates.in_stock !== undefined ? updates.in_stock : localList[idx].inStock };
    if (!updatedRecord) updatedRecord = localList[idx];
    mirrorProductsToLocal(localList);
  } else if (!updatedRecord) {
    updatedRecord = formatProductRecord({ id, ...updates });
  }

  await logActivity(actor, 'UPDATE_PRODUCT', id, { updates });
  return updatedRecord;
}

/**
 * Toggle Product Stock Status
 */
async function toggleProductStock(id, inStock, actor = 'admin') {
  try {
    await supabaseRequest(`products?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: {
        in_stock: Boolean(inStock),
        updated_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.warn('[DB] Supabase stock toggle error (mirroring to fallback):', err.message);
  }

  // Update local fallback
  const localList = loadLocalFallbackProducts();
  const idx = localList.findIndex(p => String(p.id) === String(id));
  if (idx !== -1) {
    localList[idx].inStock = Boolean(inStock);
    mirrorProductsToLocal(localList);
  }

  await logActivity(actor, inStock ? 'STOCK_IN' : 'STOCK_OUT', id, { inStock: Boolean(inStock) });
  return { id, inStock: Boolean(inStock) };
}

/**
 * Delete a product from Supabase
 */
async function deleteProduct(id, actor = 'owner') {
  try {
    await supabaseRequest(`products?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('[DB] Supabase delete error (mirroring to fallback):', err.message);
  }

  const localList = loadLocalFallbackProducts().filter(p => String(p.id) !== String(id));
  mirrorProductsToLocal(localList);

  await logActivity(actor, 'DELETE_PRODUCT', id);
  return { success: true };
}

/**
 * Fetch all categories
 */
async function getCategories() {
  try {
    const res = await supabaseRequest('categories?select=*');
    if (Array.isArray(res.data)) return res.data;
  } catch (e) {}
  return [];
}

/**
 * Fetch orders from Supabase
 */
async function getOrders() {
  try {
    const res = await supabaseRequest('orders?select=*&order=created_at.desc');
    if (Array.isArray(res.data)) return res.data;
  } catch (e) {
    console.warn('[DB] Failed to fetch orders from Supabase:', e.message);
  }
  return [];
}

/**
 * Create a new order in Supabase
 */
async function createOrder(orderData) {
  const id = orderData.id || `HOM-AD-${Math.floor(1000 + Math.random() * 9000)}`;
  const record = {
    id,
    customer: orderData.customer || '',
    phone: orderData.phone || '',
    items: Array.isArray(orderData.items) ? orderData.items : [],
    items_summary: orderData.itemsSummary || orderData.items_summary || '',
    location: orderData.location || '',
    address: orderData.address || '',
    payment_method: orderData.method || orderData.payment_method || 'COD',
    total: parseInt(orderData.total, 10) || 0,
    status: orderData.status || 'Pending',
    sms_sent: Boolean(orderData.smsSent || orderData.sms_sent),
    created_at: new Date().toISOString()
  };

  try {
    const res = await supabaseRequest('orders', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: [record]
    });
    return (Array.isArray(res.data) && res.data[0]) ? res.data[0] : record;
  } catch (err) {
    console.error('[DB] Failed to record order in Supabase:', err.message);
    return record;
  }
}

/**
 * Update order status
 */
async function updateOrderStatus(orderId, status, actor = 'admin') {
  try {
    await supabaseRequest(`orders?id=eq.${encodeURIComponent(orderId)}`, {
      method: 'PATCH',
      body: { status }
    });
    await logActivity(actor, 'UPDATE_ORDER_STATUS', orderId, { status });
  } catch (e) {
    console.warn('[DB] Failed to update order status:', e.message);
  }
}

/**
 * Store settings
 */
async function getStoreSettings() {
  try {
    const res = await supabaseRequest('settings?id=eq.store_settings&limit=1');
    if (Array.isArray(res.data) && res.data.length > 0) {
      const s = res.data[0];
      return {
        cbeAccount: s.cbe_account,
        cbeAccountName: s.cbe_account_name,
        telebirrPhone: s.telebirr_phone,
        telebirrAccountName: s.telebirr_account_name,
        chapaSecretKey: s.chapa_secret_key
      };
    }
  } catch (e) {}
  return {
    cbeAccount: "1000123456789",
    cbeAccountName: "Husen Online Store",
    telebirrPhone: "0923245529",
    telebirrAccountName: "Husen Market"
  };
}

async function saveStoreSettings(settingsObj, actor = 'owner') {
  try {
    await supabaseRequest('settings', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates' },
      body: [{
        id: 'store_settings',
        cbe_account: settingsObj.cbeAccount,
        cbe_account_name: settingsObj.cbeAccountName,
        telebirr_phone: settingsObj.telebirrPhone,
        telebirr_account_name: settingsObj.telebirrAccountName,
        chapa_secret_key: settingsObj.chapaSecretKey || '',
        updated_at: new Date().toISOString()
      }]
    });
    await logActivity(actor, 'UPDATE_SETTINGS', 'store_settings', settingsObj);
    return true;
  } catch (e) {
    console.warn('[DB] Failed to save settings in Supabase:', e.message);
    return false;
  }
}

/**
 * One-Time Migration: Import the 10 existing catalog items into Supabase
 */
async function migrateExistingProductsToSupabase() {
  const localProducts = loadLocalFallbackProducts();
  if (localProducts.length === 0) return { count: 0 };

  console.log(`[DB MIGRATION] Starting import of ${localProducts.length} catalog items into Supabase...`);
  let imported = 0;

  for (const prod of localProducts) {
    try {
      const cleanImages = sanitizeImageUrls(prod.images);
      const record = {
        id: prod.id,
        name: typeof prod.name === 'object' ? prod.name : { en: prod.name, am: prod.name, om: prod.name },
        description: typeof prod.spec === 'object' ? prod.spec : { en: prod.spec || '', am: prod.spec || '', om: prod.spec || '' },
        price: Number(prod.price) || 0,
        category: prod.category || 'general',
        secondary_category: prod.secondaryCategory || '',
        images: cleanImages,
        image_public_ids: [],
        in_stock: prod.inStock !== false,
        sort_order: Number(prod.sortOrder) || 0,
        badge: prod.badge || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await supabaseRequest('products', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: [record]
      });

      await ensureCategory(prod.category);
      imported++;
    } catch (err) {
      console.warn(`[DB MIGRATION] Failed to import product ${prod.id}:`, err.message);
    }
  }

  await logActivity('system', 'MIGRATION_INITIAL_PRODUCTS', 'catalog', { imported });
  console.log(`[DB MIGRATION] Successfully imported ${imported} products into Supabase.`);
  return { count: imported };
}

/**
 * Admin User Management (Supabase with Local Auth Fallback)
 */
async function getAdminUser(username) {
  if (!username) return null;
  const uname = username.trim().toLowerCase();
  try {
    const res = await supabaseRequest(`admins?username=eq.${encodeURIComponent(uname)}&limit=1`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      const u = res.data[0];
      return {
        id: `usr-${u.username}`,
        username: u.username,
        name: u.name || u.username,
        role: u.role || 'staff',
        passwordHash: u.password_hash
      };
    }
  } catch (e) {}

  // Local fallback
  const { getDefaultUsers } = require('./authHelper.js');
  const defaults = getDefaultUsers();
  return defaults.find(u => u.username.toLowerCase() === uname) || null;
}

async function updateAdminPassword(username, passwordHash, actor = 'owner') {
  const uname = username.trim().toLowerCase();
  try {
    await supabaseRequest(`admins?username=eq.${encodeURIComponent(uname)}`, {
      method: 'PATCH',
      body: { password_hash: passwordHash }
    });
  } catch (e) {
    console.warn('[DB] Supabase admin password update warning:', e.message);
  }
  await logActivity(actor, 'CHANGE_PASSWORD', uname);
  return true;
}

/**
 * CSV and JSON Export Generators
 */
function exportProductsToCsv(products) {
  const headers = ['ID', 'Category', 'Price (ETB)', 'In Stock', 'Name (EN)', 'Name (AM)', 'Name (OM)', 'Images'];
  const rows = (products || []).map(p => {
    const id = p.id || '';
    const cat = (p.category || '').replace(/"/g, '""');
    const price = p.price || 0;
    const stock = p.inStock ? 'Yes' : 'No';
    const nameEn = (typeof p.name === 'object' ? p.name.en || '' : p.name || '').replace(/"/g, '""');
    const nameAm = (typeof p.name === 'object' ? p.name.am || '' : p.name || '').replace(/"/g, '""');
    const nameOm = (typeof p.name === 'object' ? p.name.om || '' : p.name || '').replace(/"/g, '""');
    const imgs = (Array.isArray(p.images) ? p.images.join(' | ') : '').replace(/"/g, '""');

    return `"${id}","${cat}",${price},"${stock}","${nameEn}","${nameAm}","${nameOm}","${imgs}"`;
  });

  return [headers.join(','), ...rows].join('\r\n');
}

module.exports = {
  supabaseRequest,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStock,
  getCategories,
  getOrders,
  createOrder,
  updateOrderStatus,
  getStoreSettings,
  saveStoreSettings,
  logActivity,
  getActivityLogs,
  getAdminUser,
  updateAdminPassword,
  exportProductsToCsv,
  migrateExistingProductsToSupabase,
  sanitizeImageUrls
};
