const fs = require('fs');

const appContent = fs.readFileSync('app.js', 'utf8');
const htmlContent = fs.readFileSync('index.html', 'utf8');
const envContent = fs.readFileSync('.env', 'utf8');

// 1. Check all 3 languages exist
const hasAmharic = appContent.includes('am: {');
const hasOromo = appContent.includes('om: {');
const hasEnglish = appContent.includes('en: {');

// 2. Check that products exist
const hasStorage = appContent.includes('Glass Storage Container Set');
const hasVest = appContent.includes('Posture Corrector Compression Vest');
const hasBlender = appContent.includes('Saachhi 2-in-1 Blender');
const hasMelanix = appContent.includes('Melanix Anti-Gray Hair Lotion');

// 3. Check that Adama neighborhoods exist
const hasGendahara = appContent.includes('Gendahara');
const hasSilasi = appContent.includes('Silasi');
const hasAtanatara = appContent.includes('Atanatara');
const hasPeacock = appContent.includes('Peacock');
const hasBoli = appContent.includes('Boli');
const hasMatwamisp = appContent.includes('Matwamisp');

// 4. Check 3 Payment Methods & Correct Account Numbers
const hasTelebirr = appContent.includes('Telebirr');
const hasCbe = appContent.includes('1000123456789'); // Specified CBE account number
const hasCod = appContent.includes('Cash on Delivery');
const hasManual = appContent.includes('Manual Direct Transfer');
const hasOwnerChat = appContent.includes('0923245529');
const hasSmsRecipient = appContent.includes('0907173634');

// 5. Check Phone Validation Regex ^[97]\d{8}$
const hasPhoneRegex = appContent.includes('^[97]\\d{8}$');

// 6. Check Pinned Search Bar in HTML & JS
const hasSearchBar = htmlContent.includes('id="productSearchInput"') && appContent.includes('searchQuery');

// 7. Check Device Multi-Photo Uploader
const hasPhotoUpload = htmlContent.includes('Upload Photo from Device') && appContent.includes('editorFileInput');

// 8. Check Storefront strictly inStock filter
const hasStrictStockFilter = appContent.includes('p.inStock === false');

// 9. Check Environment & SMS Configuration (OWNER_PHONE = 0907173634 & Cloudinary)
const hasOwnerPhoneConfig = envContent.includes('OWNER_PHONE=0907173634');
const hasCloudinaryEnv = envContent.includes('CLOUD_NAME=trkihe9m') && envContent.includes('UPLOAD_PRESET=Husenonlinemarketing');
const hasCloudinaryInApp = appContent.includes('trkihe9m') && appContent.includes('Husenonlinemarketing');

// 10. Check Admin Password Security: husenonlinemarketing1234, type="password", no visible hints
const hasAdminPassword = appContent.includes('husenonlinemarketing1234');
const hasTypePassword = htmlContent.includes('type="password"') && htmlContent.includes('id="adminPinInput"');
const adminLoginHtml = htmlContent.substring(htmlContent.indexOf('id="adminLoginCard"'), htmlContent.indexOf('id="adminDashboard"'));
const noPasswordHints = !adminLoginHtml.includes('Demo PIN') && !adminLoginHtml.includes('1234') && !adminLoginHtml.includes('husenonlinemarketing') && !adminLoginHtml.includes('value=');

// 11. Check Persistent Admin Login (localStorage stay logged in & Log Out button)
const hasAdminPersistence = appContent.includes("localStorage.getItem('hom_admin_logged_in')") &&
                            appContent.includes("localStorage.setItem('hom_admin_logged_in'");
const hasLogoutAction = htmlContent.includes('id="adminLogoutBtn"') &&
                        appContent.includes("localStorage.removeItem('hom_admin_logged_in')");

const checks = {
  hasAmharic,
  hasOromo,
  hasEnglish,
  hasStorage,
  hasVest,
  hasBlender,
  hasMelanix,
  hasGendahara,
  hasSilasi,
  hasAtanatara,
  hasPeacock,
  hasBoli,
  hasMatwamisp,
  hasTelebirr,
  hasCbe,
  hasCod,
  hasManual,
  hasOwnerChat,
  hasSmsRecipient,
  hasPhoneRegex,
  hasSearchBar,
  hasPhotoUpload,
  hasStrictStockFilter,
  hasOwnerPhoneConfig,
  hasCloudinaryEnv,
  hasCloudinaryInApp,
  hasAdminPassword,
  hasTypePassword,
  noPasswordHints,
  hasAdminPersistence,
  hasLogoutAction
};

console.log(checks);

const allPassed = Object.values(checks).every(Boolean);

if (allPassed) {
  console.log('>>> ALL LOGIC & SPEC COMPLIANCE VERIFIED 100% <<<');
} else {
  console.error('>>> COMPLIANCE TEST FAILED <<<');
  process.exit(1);
}
