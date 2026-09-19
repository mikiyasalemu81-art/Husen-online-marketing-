/**
 * HUSEN ONLINE MARKETING — Zero-Config Cloud Persistence Engine
 * Seamlessly synchronizes products and payment settings across all devices
 * on Vercel Serverless Functions and Local Node Server.
 * 
 * Uses Cloudinary Raw Manifest Storage (unlimited size, CDN-cached) +
 * Global Real-Time Key-Value Pointer Index for instant cross-device updates.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CLOUD_NAME = process.env.CLOUD_NAME || 'trkihe9m';
const UPLOAD_PRESET = process.env.UPLOAD_PRESET || 'Husenonlinemarketing';
const APP_KEY = 'wkk2xy2d';
const POINTER_KEY = 'products_manifest_url';

const LOCAL_PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');
const LOCAL_SETTINGS_FILE = path.join(__dirname, '..', 'data', 'settings.json');

// In-memory cache for ultra-fast responses
let memoryCache = {
  products: null,
  settings: null,
  updatedAt: 0,
  cachedAt: 0
};

// Default initial catalog
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

const DEFAULT_SETTINGS = {
  cbeAccount: "1000123456789",
  cbeAccountName: "Husen Online Store",
  telebirrPhone: "0923245529",
  telebirrAccountName: "Husen Market"
};

// Helper: Read local disk fallback
function readLocalFallback() {
  let prods = null;
  let sets = null;

  try {
    if (fs.existsSync(LOCAL_PRODUCTS_FILE)) {
      prods = JSON.parse(fs.readFileSync(LOCAL_PRODUCTS_FILE, 'utf8'));
    }
  } catch (e) {}

  try {
    if (fs.existsSync(LOCAL_SETTINGS_FILE)) {
      sets = JSON.parse(fs.readFileSync(LOCAL_SETTINGS_FILE, 'utf8'));
    }
  } catch (e) {}

  return {
    products: Array.isArray(prods) && prods.length > 0 ? prods : DEFAULT_PRODUCTS,
    settings: sets || DEFAULT_SETTINGS
  };
}

// Helper: Save local disk file if writable
function saveLocalDisk(products, settings) {
  try {
    const dir = path.dirname(LOCAL_PRODUCTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (products) fs.writeFileSync(LOCAL_PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    if (settings) fs.writeFileSync(LOCAL_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
  } catch (e) {
    // Read-only filesystem on Vercel lambda is expected
  }
}

// Helper: Fetch URL content
function fetchJsonUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 6000 }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject).on('timeout', function() {
      this.destroy();
      reject(new Error('Cloud fetch timeout'));
    });
  });
}

// Helper: Get Pointer from KeyVal
function getPointerFromKeyVal() {
  return new Promise((resolve) => {
    https.get(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${APP_KEY}/${POINTER_KEY}`, { timeout: 5000 }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const raw = body.replace(/['"]+/g, '').trim();
        if (!raw) return resolve(null);
        try {
          const decoded = Buffer.from(raw, 'hex').toString('utf8');
          resolve(decoded.startsWith('http') ? decoded : null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null)).on('timeout', function() {
      this.destroy();
      resolve(null);
    });
  });
}

// Helper: Set Pointer in KeyVal
function setPointerInKeyVal(url) {
  return new Promise((resolve) => {
    try {
      const hexVal = Buffer.from(url).toString('hex');
      const req = https.request({
        hostname: 'keyvalue.immanuel.co',
        path: `/api/KeyVal/UpdateValue/${APP_KEY}/${POINTER_KEY}/${hexVal}`,
        method: 'POST',
        headers: { 'Content-Length': 0 },
        timeout: 5000
      }, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => resolve(true));
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

// Helper: Upload JSON manifest to Cloudinary
function uploadManifestToCloudinary(dataObj) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const content = JSON.stringify(dataObj);
    const filename = `husen_catalog_${Date.now()}.json`;

    let postBody = '';
    postBody += `--${boundary}\r\n`;
    postBody += `Content-Disposition: form-data; name="upload_preset"\r\n\r\n${UPLOAD_PRESET}\r\n`;
    postBody += `--${boundary}\r\n`;
    postBody += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
    postBody += `Content-Type: application/json\r\n\r\n${content}\r\n`;
    postBody += `--${boundary}--\r\n`;

    const req = https.request({
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUD_NAME}/raw/upload`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(postBody)
      },
      timeout: 10000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          if (parsed.secure_url) {
            resolve(parsed.secure_url);
          } else {
            reject(new Error('Cloudinary response missing secure_url'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Cloudinary upload timeout')); });
    req.write(postBody);
    req.end();
  });
}

/**
 * Get current store data (products + settings)
 * Checks cloud pointer first, falls back to memory cache and local disk.
 */
async function getStoreData(forceRefresh = false) {
  const now = Date.now();
  // Cache for 3 seconds in memory during rapid polling
  if (!forceRefresh && memoryCache.products && (now - memoryCache.cachedAt < 3000)) {
    return {
      products: memoryCache.products,
      settings: memoryCache.settings || DEFAULT_SETTINGS,
      updatedAt: memoryCache.updatedAt
    };
  }

  try {
    const manifestUrl = await getPointerFromKeyVal();
    if (manifestUrl) {
      const cloudData = await fetchJsonUrl(manifestUrl);
      if (cloudData && Array.isArray(cloudData.products)) {
        memoryCache.products = cloudData.products;
        memoryCache.settings = cloudData.settings || DEFAULT_SETTINGS;
        memoryCache.updatedAt = cloudData.updatedAt || now;
        memoryCache.cachedAt = now;
        saveLocalDisk(cloudData.products, cloudData.settings);
        return {
          products: cloudData.products,
          settings: memoryCache.settings,
          updatedAt: memoryCache.updatedAt
        };
      }
    }
  } catch (err) {
    console.warn('[CLOUD STORAGE] Pointer fetch notice:', err.message);
  }

  // If memory cache exists
  if (memoryCache.products) {
    return {
      products: memoryCache.products,
      settings: memoryCache.settings || DEFAULT_SETTINGS,
      updatedAt: memoryCache.updatedAt
    };
  }

  // Fallback to local files
  const fallback = readLocalFallback();
  memoryCache.products = fallback.products;
  memoryCache.settings = fallback.settings;
  memoryCache.updatedAt = now;
  memoryCache.cachedAt = now;

  return {
    products: fallback.products,
    settings: fallback.settings,
    updatedAt: now
  };
}

/**
 * Save store data (products and/or settings) to Cloud and Memory
 */
async function saveStoreData({ products, settings }) {
  const now = Date.now();
  const current = await getStoreData(false);

  const updatedProducts = Array.isArray(products) ? products : current.products;
  const updatedSettings = settings ? { ...current.settings, ...settings } : current.settings;

  // 1. Immediately update in-memory cache for instant responses
  memoryCache.products = updatedProducts;
  memoryCache.settings = updatedSettings;
  memoryCache.updatedAt = now;
  memoryCache.cachedAt = now;

  // 2. Save to local disk if running locally
  saveLocalDisk(updatedProducts, updatedSettings);

  // 3. Persist to Cloudinary and update Global Pointer
  try {
    const manifest = {
      products: updatedProducts,
      settings: updatedSettings,
      updatedAt: now
    };
    const cdnUrl = await uploadManifestToCloudinary(manifest);
    if (cdnUrl) {
      await setPointerInKeyVal(cdnUrl);
      console.log(`[CLOUD STORAGE] Successfully saved ${updatedProducts.length} products to cloud manifest: ${cdnUrl}`);
    }
  } catch (cloudErr) {
    console.error('[CLOUD STORAGE] Cloud persist failed:', cloudErr.message);
  }

  return {
    products: updatedProducts,
    settings: updatedSettings,
    updatedAt: now
  };
}

module.exports = {
  getStoreData,
  saveStoreData,
  DEFAULT_PRODUCTS,
  DEFAULT_SETTINGS
};
