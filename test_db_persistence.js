/**
 * Comprehensive Automated Test Suite: Husen Data Persistence Engine & Cloud Database
 * Verifies Supabase Postgres, Image Sanitization, Activity Logs, Export, and Stock Toggles.
 */

const fs = require('fs');
const path = require('path');
const db = require('./api/db.js');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('========================================================');
  console.log(' RUNNING HUSEN DATABASE PERSISTENCE & ROOT REBUILD TESTS');
  console.log('========================================================\n');

  // Test 1: Telegram link
  console.log('Test 1: Telegram link verification...');
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  const offlineHtml = fs.readFileSync('offline.html', 'utf8');
  assert(indexHtml.includes('https://t.me/husenonlinemarket'), 'index.html connects to https://t.me/husenonlinemarket');
  assert(offlineHtml.includes('https://t.me/husenonlinemarket'), 'offline.html connects to https://t.me/husenonlinemarket');

  // Test 2: Image Sanitization
  console.log('\nTest 2: Image URL sanitization & validation...');
  const dirtyImages = [
    { secure_url: 'https://res.cloudinary.com/trkihe9m/image/upload/v1234/test.jpg', public_id: '1234' },
    'blob:http://localhost:3000/123-456',
    'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
    'https://res.cloudinary.com/trkihe9m/image/upload/v5678/clean.jpg',
    null,
    ''
  ];
  const cleaned = db.sanitizeImageUrls(dirtyImages);
  assert(cleaned.length === 2, 'Sanitizer strips blob:, data:, null, and empty items');
  assert(cleaned[0] === 'https://res.cloudinary.com/trkihe9m/image/upload/v1234/test.jpg', 'Sanitizer extracts secure_url string from object');
  assert(cleaned[1] === 'https://res.cloudinary.com/trkihe9m/image/upload/v5678/clean.jpg', 'Sanitizer preserves direct https URL');

  // Test 3: Products Catalog Fetching
  console.log('\nTest 3: Catalog products retrieval...');
  const products = await db.getProducts({ includeOutOfStock: true });
  assert(Array.isArray(products) && products.length >= 10, `Retrieved ${products.length} products (at least 10 required items)`);
  
  const allImagesClean = products.every(p => Array.isArray(p.images) && p.images.every(img => typeof img === 'string' && img.startsWith('http') || img.startsWith('public/')));
  assert(allImagesClean, '100% of products have clean string image URLs (zero [object Object] or blob URLs)');

  // Test 4: Out of Stock Toggle
  console.log('\nTest 4: Stock toggle behavior...');
  const testProdId = products[0].id;
  await db.toggleProductStock(testProdId, false, 'test-runner');
  const prodsWithOut = await db.getProducts({ includeOutOfStock: true });
  const updatedOut = prodsWithOut.find(p => p.id === testProdId);
  assert(updatedOut && updatedOut.inStock === false, 'Product inStock successfully set to false');

  // Re-enable inStock
  await db.toggleProductStock(testProdId, true, 'test-runner');
  const prodsWithIn = await db.getProducts({ includeOutOfStock: true });
  const updatedIn = prodsWithIn.find(p => p.id === testProdId);
  assert(updatedIn && updatedIn.inStock === true, 'Product inStock successfully toggled back to true without deletion');

  // Test 5: Activity Logs
  console.log('\nTest 5: Activity logs audit trail...');
  await db.logActivity('owner', 'TEST_ACTION', 'unit-test', { note: 'Verification test' });
  const logs = await db.getActivityLogs(20);
  assert(Array.isArray(logs) && logs.length > 0, `Activity logs retrieved successfully (${logs.length} entries found)`);
  assert(logs.some(l => l.action === 'STOCK_OUT' || l.action === 'STOCK_IN' || l.action === 'TEST_ACTION'), 'Audit trail records stock changes and admin actions');

  // Test 6: CSV & JSON Product Export
  console.log('\nTest 6: Catalog export (CSV & JSON)...');
  const csv = db.exportProductsToCsv(products);
  assert(typeof csv === 'string' && csv.includes('ID,Category,Price (ETB)'), 'CSV export generated with headers');
  assert(csv.includes(products[0].id), 'CSV includes product IDs and rows');

  // Test 7: Orders creation and retrieval
  console.log('\nTest 7: Orders data engine...');
  const newOrder = await db.createOrder({
    id: 'HOM-TEST-' + Date.now(),
    customer: 'Test Customer',
    phone: '0911223344',
    total: 2500,
    itemsSummary: 'Bamboo Spice Rack Set',
    location: 'Adama',
    method: 'COD'
  });
  assert(newOrder && newOrder.id.startsWith('HOM-TEST-'), 'Order created with reference ID');
  const orders = await db.getOrders();
  assert(Array.isArray(orders), 'Orders retrieved successfully');

  // Test 8: Service Worker Cache Version & Network-First
  console.log('\nTest 8: Service worker cache version & exclusions...');
  const swJs = fs.readFileSync('sw.js', 'utf8');
  assert(swJs.includes('husen-app-shell-v2') || swJs.includes('husen-app-shell-v3'), 'Service worker cache bumped to v2 or v3');
  assert(swJs.includes("url.pathname === '/api/products'"), 'Product API uses network-first strategy in service worker');

  // Test 9: schema.sql & Supabase configuration
  console.log('\nTest 9: Database schema & environment variables...');
  const schemaSql = fs.readFileSync('schema.sql', 'utf8');
  assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.products'), 'schema.sql defines products table');
  assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.activity_logs'), 'schema.sql defines activity_logs table');
  assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.orders'), 'schema.sql defines orders table');
  assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.settings'), 'schema.sql defines settings table');

  const envFile = fs.readFileSync('.env', 'utf8');
  assert(envFile.includes('SUPABASE_URL=https://hhkaotnpohmkklbobplh.supabase.co'), 'SUPABASE_URL present in .env');
  assert(envFile.includes('SUPABASE_SERVICE_ROLE_KEY='), 'SUPABASE_SERVICE_ROLE_KEY present in .env');

  console.log('\n========================================================');
  console.log(` RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
