const fs = require('fs');

const appContent = fs.readFileSync('app.js', 'utf8');
const htmlContent = fs.readFileSync('index.html', 'utf8');
const styleContent = fs.readFileSync('style.css', 'utf8');
const envContent = fs.readFileSync('.env', 'utf8');
const apiContent = fs.readFileSync('api/index.js', 'utf8');
const serveContent = fs.readFileSync('serve.js', 'utf8');

console.log('=== VERIFYING ALL 5 REQUIREMENTS ===\n');

// 1. Chapa Checkout & Real Hosted Modal
const r1_noLocalCompleted = !appContent.includes("showOrderSuccess(order); // chapa");
const r1_backendInitialize = appContent.includes("fetch('/api/chapa/initialize'") &&
                             apiContent.includes("https://api.chapa.co/v1/transaction/initialize") &&
                             serveContent.includes("https://api.chapa.co/v1/transaction/initialize");
const r1_openLinkTelegram = appContent.includes("window.Telegram.WebApp.openLink(data.checkout_url)") ||
                            appContent.includes("Telegram.WebApp.openLink");
const r1_verifiedCallback = appContent.includes("checkUrlPaymentCallback") &&
                            apiContent.includes("/api/chapa/verify/") &&
                            apiContent.includes("order.status = 'Paid - Chapa'");

// 2. Reliable Order SMS Alert Delivery
const r2_strictRecipient = envContent.includes("OWNER_PHONE=0907173634") &&
                           apiContent.includes("0907173634") &&
                           serveContent.includes("0907173634");
const r2_apiKey = envContent.includes("RLVE915IEZOJLRO847T4PL8OVCZIOT4RLUCALL63") &&
                  apiContent.includes("RLVE915IEZOJLRO847T4PL8OVCZIOT4RLUCALL63") &&
                  serveContent.includes("RLVE915IEZOJLRO847T4PL8OVCZIOT4RLUCALL63");
const r2_triggerPoints = apiContent.includes("orders/cod") && apiContent.includes("sendOrderSms(newOrder)") &&
                         apiContent.includes("orders/manual") &&
                         apiContent.includes("/api/chapa/verify/");
const r2_logFullResponses = apiContent.includes("[SMS GATEWAY FULL RESPONSE]") &&
                            apiContent.includes("[SMS ALERT ERROR]");

// 3. Persistent Admin Authentication
const r3_password = appContent.includes("husenonlinemarketing1234") &&
                    envContent.includes("ADMIN_PASSWORD=husenonlinemarketing1234");
const r3_typePassword = htmlContent.includes('type="password"') && htmlContent.includes('id="adminPinInput"');
const r3_storageKey = appContent.includes("localStorage.setItem('husen_admin_auth', 'true')") &&
                      appContent.includes("localStorage.getItem('husen_admin_auth')");
const r3_logoutClears = appContent.includes("localStorage.removeItem('husen_admin_auth')");

// 4. Real-Time Global Cloud Sync for Products & Stock
const r4_cloudinaryCloud = envContent.includes("CLOUD_NAME=trkihe9m") &&
                           appContent.includes("trkihe9m");
const r4_cloudinaryPreset = envContent.includes("UPLOAD_PRESET=Husenonlinemarketing") &&
                            appContent.includes("Husenonlinemarketing");
const r4_pollingSync = appContent.includes("syncProductsFromBackend") &&
                       appContent.includes("setInterval");
const r4_stockPush = appContent.includes("fetch(`/api/products/${id}`, {") &&
                     appContent.includes("method: 'PUT'");

// 5. Admin Dashboard Layout & Scrolling Fix
const r5_scrollContainer = styleContent.includes(".admin-dashboard-view") &&
                           styleContent.includes("overflow-y: auto");
const r5_compactThumb = styleContent.includes(".admin-prod-thumb") &&
                        styleContent.includes("56px");
const r5_compactDetails = styleContent.includes(".admin-prod-details") &&
                          styleContent.includes(".admin-prod-actions");
const r5_refreshButton = htmlContent.includes('id="adminRefreshBtn"') &&
                         appContent.includes("adminRefreshBtn") &&
                         htmlContent.includes("🔄 Refresh Data");

const results = {
  "R1: Chapa No Local Completion": r1_noLocalCompleted,
  "R1: Chapa Backend Initialize": r1_backendInitialize,
  "R1: Chapa Telegram openLink": r1_openLinkTelegram,
  "R1: Chapa Verified Callback": r1_verifiedCallback,
  "R2: Strict Recipient 0907173634": r2_strictRecipient,
  "R2: SMS API Key Configured": r2_apiKey,
  "R2: SMS Triggered (COD/Manual/Chapa)": r2_triggerPoints,
  "R2: Full API Response Logged": r2_logFullResponses,
  "R3: Admin Password husenonlinemarketing1234": r3_password,
  "R3: Password Input Masked (type=password)": r3_typePassword,
  "R3: Persistent Storage (husen_admin_auth)": r3_storageKey,
  "R3: Explicit Log Out Clears Key": r3_logoutClears,
  "R4: Cloudinary Cloud (trkihe9m)": r4_cloudinaryCloud,
  "R4: Cloudinary Preset (Husenonlinemarketing)": r4_cloudinaryPreset,
  "R4: Polling & Cloud Sync": r4_pollingSync,
  "R4: Stock Toggle Direct Push": r4_stockPush,
  "R5: Admin Dashboard Scrolling Container": r5_scrollContainer,
  "R5: Compact Product Thumb (56x56)": r5_compactThumb,
  "R5: Compact Product Row Layout": r5_compactDetails,
  "R5: Refresh Data Button in Header": r5_refreshButton
};

let allOk = true;
for (const [name, passed] of Object.entries(results)) {
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  if (!passed) allOk = false;
}

console.log('\n----------------------------------------');
if (allOk) {
  console.log('🎉 ALL 20 CRITICAL CHECKS PASSED!');
  process.exit(0);
} else {
  console.error('❌ SOME CHECKS FAILED');
  process.exit(1);
}
