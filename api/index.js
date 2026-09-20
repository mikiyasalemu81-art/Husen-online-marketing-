const https = require('https');
const fs = require('fs');
const path = require('path');

const SMS_API_KEY = process.env.SMS_API_KEY || 'RLVE915IEZOJLRO847T4PL8OVCZIOT4RLUCALL63';
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-sample';
const OWNER_PHONE = process.env.OWNER_PHONE || '0907173634';
const CLOUD_NAME = process.env.CLOUD_NAME || 'trkihe9m';
const UPLOAD_PRESET = process.env.UPLOAD_PRESET || 'Husenonlinemarketing';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'husenonlinemarketing1234';

const { getStoreData, saveStoreData } = require('./cloudStorage.js');

// Default initial products
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    category: "kitchen",
    price: 1450,
    inStock: true,
    images: ["public/images/storage1.jpg"],
    name: {
      am: "የብርጭቆ ዕቃ መያዣ (4 ፍሬ)",
      om: "Qodaa Fuullee Nyaataa (Cimdi 4)",
      en: "Glass Storage Container Set (4-piece)"
    },
    spec: {
      am: "እርስ በርስ የሚገጣጠሙ፣ አየር የማያስገቡ ክሊፕ-መቆለፊያ ክዳን ያላቸው ጥራት ያላቸው የብርጭቆ ዕቃዎች።",
      om: "Qulqullina olaanaa, qilleensa kan hin galchine, cufaa jabaa kan qabu.",
      en: "Nesting, clip-lock lids, airtight premium glass containers."
    },
    fullDesc: {
      am: "4 የተለያየ መጠን ያላቸው የብርጭቆ ዕቃዎች። አየር የማያስገባ ክሊፕ ክዳን ያላቸው ሲሆን በማቀዝቀዣ፣ ማይክሮዌቭ እና በእቃ ማጠቢያ ውስጥ በደህና መጠቀም ይቻላል።",
      om: "Qodaa fuullee gosa 4 kan wal keessa galuu danda'an. Cufaa jabaa qilleensa ittisu kan qaban, firiijii fi maaykirooweevii keessatti fayyadamuuf kan ta'an.",
      en: "Set of 4 heavy-duty glass containers with snap-tight clip lids. Airtight silicone seal preserves freshness. Oven, microwave, freezer and dishwasher safe."
    },
    badge: { am: "ኦሪጅናል", om: "Qulqullina", en: "Original" }
  },
  {
    id: "prod-2",
    category: "health",
    price: 1200,
    inStock: true,
    images: ["public/images/vest1.jpg", "public/images/vest2.jpg"],
    name: {
      am: "የጀርባ አቋም ማስተካከያ ቬስት",
      om: "Vestii Dugdaa Sirreessu",
      en: "Posture Corrector Compression Vest"
    },
    spec: {
      am: "የጀርባ አጥንትን እና ትከሻን የሚያስተካክል፣ የሚለጠጥና ምቹ የድጋፍ ቬስት።",
      om: "Dugda fi ceekuuf deeggarsa kan kennu, mijataa fi sirreeffamuu kan danda'u.",
      en: "Adjustable back support, breathable compression vest."
    },
    fullDesc: {
      am: "ለትከሻና ለጀርባ ህመም ፈጣን እፎይታ የሚሰጥ። በልብስ ስር የማይታወቅ፣ የሚለጠጥና እንደ ሰውነት መጠን የሚስተካከል የጀርባ አቋም ማስተካከያ።",
      om: "Dhukkubbi dugdaa fi ceekuu salphisuuf kan gargaaru. Uffata jalatti kan hin mul'anne, salphaatti kan sirreeffamu fi hargansuuf mijataa ta'e.",
      en: "Ergonomic compression vest designed to pull shoulders back and align the spine. Breathable, discreet under clothing, and fully adjustable for all-day posture relief."
    },
    badge: { am: "ተወዳጅ", om: "Filatamaa", en: "Best Seller" }
  },
  {
    id: "prod-3",
    category: "kitchen",
    secondaryCategory: "home",
    price: 2850,
    inStock: true,
    images: ["public/images/blender1.jpg", "public/images/blender2.jpg"],
    name: {
      am: "ሳቺ 2-በ-1 ፈጪ እና መፍጫ",
      om: "Saachhi 2-in-1 Blenders (Makiinaa Harcaatuu)",
      en: "Saachhi 2-in-1 Blender"
    },
    spec: {
      am: "350W ኃይለኛ ሞተር፣ ሁለት ጃር እና ተጨማሪ መፍጫ ያለው ጥራት ያለው ማደባለቂያ።",
      om: "Motora humna 350W qabu, qodaa lama fi meeshaa daakuu wajjin.",
      en: "350W motor, two jars plus grinder attachment."
    },
    fullDesc: {
      am: "የሳቺ ኦሪጅናል 2-በ-1 ፈጪ። ፍራፍሬዎችን፣ ጁሶችን እና አትክልቶችን በቀላሉ የሚፈጭ ትልቅ ጃር እንዲሁም ቡና፣ ቅመማቅመም እና ደረቅ ነገሮችን የሚፈጭ ተጨማሪ ማያያዣ አለው።",
      om: "Saachhi 2-in-1 kan buna, mi'eessituu fi muduraa daakuuf gargaaru. Motora 350W jabaa, qodaa lama fi haaduu sibiila hin danda'amne qaba.",
      en: "Powerful 350W Saachhi blender featuring a large blending jug for juices/smoothies and a specialized stainless steel milling grinder for coffee, grains, and spices."
    },
    badge: { am: "ኃይለኛ", om: "Cimaa", en: "350W Power" }
  },
  {
    id: "prod-4",
    category: "beauty",
    price: 950,
    inStock: true,
    images: ["public/images/melanix.jpg"],
    name: {
      am: "ሜላኒክስ የፀጉር ቅባት",
      om: "Qoricha Rifeensaa Melanix",
      en: "Melanix Anti-Gray Hair Lotion"
    },
    spec: {
      am: "ከተፈጥሮ ንጥረነገሮች የተዘጋጀ፣ ሽበትን የሚከላከልና ተፈጥሮአዊ የፀጉር ቀለምን የሚመልስ ቅባት።",
      om: "Qoricha uumamaa rifeensa arrii ittisuu fi bifa uumamaa deebisu.",
      en: "All-natural botanical formula restores youthful natural hair."
    },
    fullDesc: {
      am: "ሜላኒክስ የጸጉርን ተፈጥሯዊ ሜላኒን በማነቃቃት የነጣ ፀጉርን ደረጃ በደረጃ ወደ ቀደመው ጥቁር ቀለም ይመልሳል። ምንም ዓይነት ጎጂ ኬሚካል የሌለው።",
      om: "Melanix rifeensa arrii gara bifa uumamaatti deebisuuf kan gargaaru. Kemikaala miidhaa qabu kan hin qabne, dhiiraafis dubartootaafis kan ta'u.",
      en: "Formulated with plant-derived actives to gently revitalize natural melanin synthesis in graying roots. Chemical dye-free, nourishing and suitable for both men and women."
    },
    badge: { am: "ተፈጥሯዊ", om: "Uumamaa", en: "Natural" }
  }
];

let memoryProducts = [...DEFAULT_PRODUCTS];
let memorySettings = {
  cbeAccount: "1000123456789",
  cbeAccountName: "Husen Online Store",
  telebirrPhone: "0923245529",
  telebirrAccountName: "Husen Market"
};

// Persistent in-memory storage during lambda lifetime
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

function getRequestBody(req) {
  return new Promise((resolve) => {
    if (req.body) {
      if (typeof req.body === 'string') {
        try {
          return resolve(JSON.parse(req.body));
        } catch (e) {
          return resolve({});
        }
      }
      return resolve(req.body);
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

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

// Send automated SMS notification strictly adhering to specification
async function sendOrderSms(order) {
  const formattedCustomerPhone = formatEthiopianPhone(order.phone);
  const locationText = order.address ? `${order.location}, ${order.address}` : order.location;
  
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

  const recipientFormatted = formatEthiopianPhone(OWNER_PHONE);

  console.log('\n================== DISPATCHING SMS NOTIFICATION ==================');
  console.log(`To: ${recipientFormatted} (Owner Phone: ${OWNER_PHONE})`);
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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // --- API ROUTE: Products CRUD ---
  if (pathname === '/api/products') {
    if (req.method === 'GET') {
      const store = await getStoreData();
      return res.status(200).json({ success: true, products: store.products, updatedAt: store.updatedAt });
    }

    if (req.method === 'POST') {
      try {
        const newProd = await getRequestBody(req);
        if (!newProd.name || !newProd.price) {
          return res.status(400).json({ success: false, error: 'Product name and price are required' });
        }
        const id = newProd.id || ('prod-' + Date.now());
        const product = {
          id: id,
          category: newProd.category || 'home',
          secondaryCategory: newProd.secondaryCategory || '',
          price: Number(newProd.price),
          inStock: newProd.inStock !== false,
          images: Array.isArray(newProd.images) && newProd.images.length > 0 ? newProd.images : ['public/images/storage1.jpg'],
          name: typeof newProd.name === 'object' ? newProd.name : { en: newProd.name, am: newProd.name, om: newProd.name },
          spec: typeof newProd.spec === 'object' ? newProd.spec : { en: newProd.spec || newProd.description || '', am: newProd.spec || newProd.description || '', om: newProd.spec || newProd.description || '' },
          fullDesc: typeof newProd.fullDesc === 'object' ? newProd.fullDesc : { en: newProd.fullDesc || newProd.description || '', am: newProd.fullDesc || newProd.description || '', om: newProd.fullDesc || newProd.description || '' },
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

        const saved = await saveStoreData({ products: updatedList });
        return res.status(201).json({ success: true, product, products: saved.products, updatedAt: saved.updatedAt });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }
  }

  if (pathname.startsWith('/api/products/')) {
    const prodId = pathname.replace('/api/products/', '');

    if (req.method === 'PUT') {
      try {
        const updateData = await getRequestBody(req);
        const store = await getStoreData(false);
        const idx = store.products.findIndex(p => p.id === prodId);
        if (idx === -1) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const existing = store.products[idx];
        const updated = {
          ...existing,
          ...updateData,
          id: prodId,
          price: updateData.price !== undefined ? Number(updateData.price) : existing.price,
          inStock: updateData.inStock !== undefined ? Boolean(updateData.inStock) : existing.inStock,
          images: Array.isArray(updateData.images) && updateData.images.length > 0 ? updateData.images : existing.images
        };

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

        const saved = await saveStoreData({ products: updatedList });
        return res.status(200).json({ success: true, product: updated, products: saved.products, updatedAt: saved.updatedAt });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    if (req.method === 'DELETE') {
      try {
        const store = await getStoreData(false);
        const idx = store.products.findIndex(p => p.id === prodId);
        if (idx === -1) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        const updatedList = store.products.filter(p => p.id !== prodId);
        const saved = await saveStoreData({ products: updatedList });
        return res.status(200).json({ success: true, message: 'Product deleted', products: saved.products, updatedAt: saved.updatedAt });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }
  }

  // --- API ROUTE: Settings ---
  if (pathname === '/api/settings') {
    if (req.method === 'GET') {
      const store = await getStoreData();
      return res.status(200).json({ success: true, settings: store.settings });
    }
    if (req.method === 'POST') {
      try {
        const newSettings = await getRequestBody(req);
        const store = await getStoreData(false);
        const mergedSettings = {
          ...store.settings,
          cbeAccount: newSettings.cbeAccount || store.settings.cbeAccount,
          cbeAccountName: newSettings.cbeAccountName || store.settings.cbeAccountName,
          telebirrPhone: newSettings.telebirrPhone || store.settings.telebirrPhone,
          telebirrAccountName: newSettings.telebirrAccountName || store.settings.telebirrAccountName,
          chapaSecretKey: newSettings.chapaSecretKey !== undefined ? newSettings.chapaSecretKey : store.settings.chapaSecretKey
        };
        const saved = await saveStoreData({ settings: mergedSettings });
        return res.status(200).json({ success: true, settings: saved.settings });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }
  }

  // --- API ROUTE: Config ---
  if (pathname === '/api/config' && req.method === 'GET') {
    return res.status(200).json({
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      ownerPhone: OWNER_PHONE
    });
  }

  // --- API ROUTE: Admin Verify Login Password ---
  if (pathname === '/api/admin/verify' && req.method === 'POST') {
    try {
      const body = await getRequestBody(req);
      if (body.password === ADMIN_PASSWORD) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ success: false, error: 'Incorrect password' });
      }
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // --- API ROUTE: Test SMS Dispatch to 0907173634 ---
  if (pathname === '/api/admin/test-sms' && req.method === 'POST') {
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
    return res.status(200).json({
      success: smsResult.success,
      recipient: OWNER_PHONE,
      statusCode: smsResult.statusCode,
      response: smsResult.response
    });
  }

  // --- API ROUTE: Cash on Delivery ---
  if (req.method === 'POST' && pathname === '/api/orders/cod') {
    try {
      const orderData = await getRequestBody(req);
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
      await sendOrderSms(newOrder);

      return res.status(200).json({ success: true, order: newOrder });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // --- API ROUTE: Manual Direct Transfer ---
  if (req.method === 'POST' && pathname === '/api/orders/manual') {
    try {
      const orderData = await getRequestBody(req);
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
      await sendOrderSms(newOrder);

      return res.status(200).json({ success: true, order: newOrder });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // --- API ROUTE: Chapa Initialize ---
  if (req.method === 'POST' && pathname === '/api/chapa/initialize') {
    try {
      const reqData = await getRequestBody(req);
      const tx_ref = reqData.tx_ref || ('HOM-tx-' + Date.now());
      const cleanPhone = (reqData.phone_number || '').replace(/[^0-9]/g, '');
      const host = req.headers.host || 'husen-online-marketing.vercel.app';
      const protocol = req.headers['x-forwarded-proto'] || 'https';

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

      const store = await getStoreData();
      const activeKey = (store && store.settings && store.settings.chapaSecretKey) || process.env.CHAPA_SECRET_KEY || CHAPA_SECRET_KEY;

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

      const chapaRes = await callChapaInitialize(chapaPayload, activeKey);
      if (chapaRes.status === 'success' && chapaRes.data && chapaRes.data.checkout_url) {
        return res.status(200).json({
          status: "success",
          checkout_url: chapaRes.data.checkout_url,
          tx_ref: tx_ref
        });
      } else {
        return res.status(200).json({
          status: "error",
          message: chapaRes.message || 'Chapa initialization failed. Please check your Secret Key in Admin Settings.',
          tx_ref: tx_ref
        });
      }
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  }

  // --- API ROUTE: Chapa Verify ---
  if (req.method === 'GET' && pathname.startsWith('/api/chapa/verify/')) {
    const txRef = pathname.replace('/api/chapa/verify/', '');
    await callChapaVerify(txRef);
    const order = orders.find(o => o.id === txRef);
    if (order && !order.smsSent) {
      order.status = 'Paid - Chapa';
      order.smsSent = true;
      await sendOrderSms(order);
    }
    return res.status(200).json({ status: "success", order: order || null });
  }

  // --- API ROUTE: List Orders ---
  if (req.method === 'GET' && pathname === '/api/orders') {
    return res.status(200).json({ orders });
  }

  // --- PAYMENT SUCCESS REDIRECT ---
  if (pathname === '/payment-success') {
    const tx_ref = url.searchParams.get('tx_ref');
    const order = orders.find(o => o.id === tx_ref);
    if (order && !order.smsSent) {
      order.status = 'Paid - Chapa';
      order.smsSent = true;
      await sendOrderSms(order);
    }
    res.writeHead(302, { 'Location': `/?payment=success&tx_ref=${encodeURIComponent(tx_ref || '')}` });
    return res.end();
  }

  res.status(404).send('Not Found');
};
