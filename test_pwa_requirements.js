const fs = require('fs');
const path = require('path');
const assert = require('assert');

function runTest() {
  console.log('========================================================');
  console.log(' RUNNING HUSEN PWA & INSTALL APP REQUIREMENTS VERIFICATION');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Check manifest.webmanifest
  test('1. manifest.webmanifest exists and meets all PWA requirements', () => {
    assert(fs.existsSync('manifest.webmanifest'), 'manifest.webmanifest must exist');
    const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
    assert.strictEqual(manifest.name, 'Husen Online Marketing', 'name must be Husen Online Marketing');
    assert.strictEqual(manifest.short_name, 'Husen', 'short_name must be Husen');
    assert.strictEqual(manifest.start_url, '/', 'start_url must be /');
    assert.strictEqual(manifest.scope, '/', 'scope must be /');
    assert.strictEqual(manifest.display, 'standalone', 'display must be standalone');
    assert.strictEqual(manifest.background_color.toLowerCase(), '#faf7f5', 'background_color must be #faf7f5');
    assert.strictEqual(manifest.theme_color.toLowerCase(), '#d92a2a', 'theme_color must be #d92a2a');
    assert(manifest.id, 'id field must exist');
    
    // Check icons
    assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'manifest must have at least 3 icons');
    const has192 = manifest.icons.some(i => i.sizes === '192x192' && i.type === 'image/png');
    const has512 = manifest.icons.some(i => i.sizes === '512x512' && i.type === 'image/png' && i.purpose !== 'maskable');
    const hasMaskable = manifest.icons.some(i => i.sizes === '512x512' && i.purpose === 'maskable');
    assert(has192, 'must have 192x192 icon');
    assert(has512, 'must have 512x512 icon');
    assert(hasMaskable, 'must have 512x512 maskable icon');
  });

  // 2. Check admin.webmanifest
  test('2. admin.webmanifest exists with start_url /admin and separate branding', () => {
    assert(fs.existsSync('admin.webmanifest'), 'admin.webmanifest must exist');
    const adminManifest = JSON.parse(fs.readFileSync('admin.webmanifest', 'utf8'));
    assert.strictEqual(adminManifest.name, 'Husen Admin', 'admin name must be Husen Admin');
    assert.strictEqual(adminManifest.start_url, '/admin', 'start_url must be /admin');
    assert.strictEqual(adminManifest.scope, '/admin', 'scope must be /admin');
    assert(adminManifest.icons && adminManifest.icons.length >= 2, 'admin manifest must have icons');
  });

  // 3. Check Generated Icons
  test('3. Icon files exist in root and public with correct PNG dimensions', () => {
    const icons = [
      'favicon-192x192.png',
      'icon-512.png',
      'icon-512-maskable.png',
      'apple-touch-icon.png',
      'admin-icon-192.png',
      'admin-icon-512.png',
      'admin-icon-maskable.png',
      'admin-apple-touch-icon.png'
    ];
    icons.forEach(iconName => {
      assert(fs.existsSync(iconName), `${iconName} must exist in root`);
      assert(fs.existsSync(`public/${iconName}`), `public/${iconName} must exist`);
      const stat = fs.statSync(iconName);
      assert(stat.size > 1000, `${iconName} file size must be > 1KB`);
    });
  });

  // 4. Check index.html Head Meta Tags
  test('4. index.html contains all PWA and iOS meta tags', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert(html.includes('rel="manifest" href="/manifest.webmanifest"'), 'must link /manifest.webmanifest');
    assert(html.includes('<meta name="theme-color" content="#d92a2a">'), 'must have theme-color #d92a2a');
    assert(html.includes('<meta name="apple-mobile-web-app-capable" content="yes">'), 'must have apple-mobile-web-app-capable');
    assert(html.includes('<meta name="apple-mobile-web-app-title" content="Husen">'), 'must have apple-mobile-web-app-title');
    assert(html.includes('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">'), 'must have apple-touch-icon');
  });

  // 5. Check Service Worker sw.js
  test('5. sw.js implements app shell caching, network-first products, and no-cache admin', () => {
    assert(fs.existsSync('sw.js'), 'sw.js must exist');
    const sw = fs.readFileSync('sw.js', 'utf8');
    assert(sw.includes('/api/products'), 'sw.js must handle /api/products');
    assert(sw.includes('/offline.html'), 'sw.js must reference /offline.html');
    assert(sw.includes('isExcludedFromCache'), 'sw.js must have exclusion helper');
    assert(sw.includes('/api/admin'), 'sw.js must exclude /api/admin');
    assert(sw.includes('/api/chapa'), 'sw.js must exclude /api/chapa');
    assert(sw.includes('/api/orders'), 'sw.js must exclude /api/orders');
    assert(sw.includes('cloudinary.com'), 'sw.js must handle Cloudinary cache');
  });

  // 6. Check offline.html
  test('6. offline.html exists with trilingual support and retry/call links', () => {
    assert(fs.existsSync('offline.html'), 'offline.html must exist');
    const offline = fs.readFileSync('offline.html', 'utf8');
    assert(offline.includes('0923245529'), 'offline.html must provide direct shop phone');
    assert(offline.includes('አማርኛ'), 'offline.html must include Amharic');
    assert(offline.includes('Afaan Oromoo'), 'offline.html must include Afaan Oromo');
    assert(offline.includes('window.location.reload()'), 'offline.html must have reload button');
  });

  // 7. Check Translations in app.js
  test('7. app.js contains full translations in English, Amharic, and Afaan Oromo', () => {
    const appJs = fs.readFileSync('app.js', 'utf8');
    ['am', 'om', 'en'].forEach(lang => {
      assert(appJs.includes(`installBtn:`), 'must have installBtn in dictionary');
      assert(appJs.includes(`installBannerTitle:`), 'must have installBannerTitle in dictionary');
      assert(appJs.includes(`installBannerSub:`), 'must have installBannerSub in dictionary');
      assert(appJs.includes(`iosInstallTitle:`), 'must have iosInstallTitle in dictionary');
      assert(appJs.includes(`inAppTitle:`), 'must have inAppTitle in dictionary');
      assert(appJs.includes(`copyLinkBtn:`), 'must have copyLinkBtn in dictionary');
    });
    // Check specific required text
    assert(appJs.includes('Add Husen to your home screen for faster shopping'), 'English subtitle required');
    assert(appJs.includes('ለፈጣን ግብይት ሁሴንን ወደ ስልክዎ መነሻ ገጽ ያክሉ'), 'Amharic subtitle required');
    assert(appJs.includes('Bittaa saffisaaf Husen gara iskiriinii jalqabaatti dabalaa'), 'Oromo subtitle required');
  });

  // 8. Check Install UI Elements in index.html and app.js
  test('8. Install button, dismissible banner, iOS sheet, and in-app modal exist', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    const appJs = fs.readFileSync('app.js', 'utf8');
    
    // Elements in HTML
    assert(html.includes('id="headerInstallBtn"'), 'must have headerInstallBtn in index.html');
    assert(html.includes('id="installBanner"'), 'must have installBanner in index.html');
    assert(html.includes('id="closeInstallBannerBtn"'), 'must have closeInstallBannerBtn in index.html');
    assert(html.includes('id="iosInstallSheet"'), 'must have iosInstallSheet in index.html');
    assert(html.includes('id="inAppBrowserModal"'), 'must have inAppBrowserModal in index.html');
    assert(html.includes('id="btnCopyStoreLink"'), 'must have btnCopyStoreLink in index.html');

    // JS Logic
    assert(appJs.includes('beforeinstallprompt'), 'must handle beforeinstallprompt');
    assert(appJs.includes('appinstalled'), 'must handle appinstalled');
    assert(appJs.includes('detectInAppBrowser'), 'must detect in-app browsers');
    assert(appJs.includes('detectIOSSafari'), 'must detect iOS Safari');
    assert(appJs.includes('hom_install_dismissed_time'), 'must remember 7-day snooze');
    assert(appJs.includes('display-mode: standalone'), 'must check standalone mode');
  });

  // 9. Check Admin Dashboard Isolation & admin.html
  test('9. Admin portal does not show install banner, and admin.html is standalone PWA', () => {
    assert(fs.existsSync('admin.html'), 'admin.html must exist');
    const adminHtml = fs.readFileSync('admin.html', 'utf8');
    assert(adminHtml.includes('rel="manifest" href="/admin.webmanifest"'), 'admin.html must link admin.webmanifest');
    assert(adminHtml.includes('admin-icon-192.png'), 'admin.html must use admin icon');
    assert(!adminHtml.includes('id="installBanner"'), 'admin.html must not show customer install banner');

    const appJs = fs.readFileSync('app.js', 'utf8');
    assert(appJs.includes("pathname.startsWith('/admin')"), 'app.js must guard against showing banner on /admin');
  });

  // 10. Check Vercel & Serve.js configuration
  test('10. vercel.json and serve.js properly configure webmanifest and admin rewrites', () => {
    const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    const serve = fs.readFileSync('serve.js', 'utf8');

    // Vercel rewrites
    const hasAdminRewrite = vercel.rewrites.some(r => r.source === '/admin' && r.destination === '/admin.html');
    assert(hasAdminRewrite, 'vercel.json must rewrite /admin to /admin.html');

    // Serve.js static handling
    assert(serve.includes('/admin.html'), 'serve.js must handle /admin route');
    assert(serve.includes('Service-Worker-Allowed'), 'serve.js must set Service-Worker-Allowed header');
  });

  console.log('\n========================================================');
  console.log(` RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) process.exit(1);
}

runTest();
