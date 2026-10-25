const http = require('http');
const { spawn } = require('child_process');
const assert = require('assert');

async function runHttpTests() {
  console.log('Testing HTTP Server static serving & PWA routes...');
  const PORT = 3456;
  const env = { ...process.env, PORT: PORT.toString() };

  const serverProc = spawn('node', ['serve.js'], { env, stdio: 'pipe' });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  function request(path) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}${path}`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }).on('error', reject);
    });
  }

  try {
    // 1. Root page
    const r1 = await request('/');
    assert.strictEqual(r1.status, 200);
    assert(r1.body.includes('/manifest.webmanifest'), 'Must link manifest.webmanifest');
    assert(r1.body.includes('theme-color'), 'Must include theme-color');
    console.log('  ✓ [PASS] GET / -> 200 OK (includes PWA head tags)');

    // 2. Customer manifest
    const r2 = await request('/manifest.webmanifest');
    assert.strictEqual(r2.status, 200);
    assert(r2.headers['content-type'].includes('application/manifest+json'), 'Correct manifest MIME');
    const m2 = JSON.parse(r2.body);
    assert.strictEqual(m2.name, 'Husen Online Marketing');
    assert.strictEqual(m2.short_name, 'Husen');
    console.log('  ✓ [PASS] GET /manifest.webmanifest -> 200 OK application/manifest+json');

    // 3. Admin manifest
    const r3 = await request('/admin.webmanifest');
    assert.strictEqual(r3.status, 200);
    assert(r3.headers['content-type'].includes('application/manifest+json'), 'Correct admin manifest MIME');
    const m3 = JSON.parse(r3.body);
    assert.strictEqual(m3.name, 'Husen Admin');
    assert.strictEqual(m3.start_url, '/admin');
    console.log('  ✓ [PASS] GET /admin.webmanifest -> 200 OK application/manifest+json (Husen Admin)');

    // 4. Service Worker
    const r4 = await request('/sw.js');
    assert.strictEqual(r4.status, 200);
    assert.strictEqual(r4.headers['service-worker-allowed'], '/', 'Service-Worker-Allowed header must be /');
    assert(r4.body.includes('husen-app-shell'), 'SW body valid');
    console.log('  ✓ [PASS] GET /sw.js -> 200 OK with Service-Worker-Allowed: /');

    // 5. Offline page
    const r5 = await request('/offline.html');
    assert.strictEqual(r5.status, 200);
    assert(r5.body.includes('No Internet Connection'), 'Friendly offline text present');
    console.log('  ✓ [PASS] GET /offline.html -> 200 OK');

    // 6. Admin standalone page
    const r6 = await request('/admin');
    assert.strictEqual(r6.status, 200);
    assert(r6.body.includes('/admin.webmanifest'), 'Admin links admin.webmanifest');
    console.log('  ✓ [PASS] GET /admin -> 200 OK (serves admin.html with admin manifest)');

    // 7. Icons
    const r7 = await request('/icon-512-maskable.png');
    assert.strictEqual(r7.status, 200);
    assert.strictEqual(r7.headers['content-type'], 'image/png');
    console.log('  ✓ [PASS] GET /icon-512-maskable.png -> 200 OK image/png');

    const r8 = await request('/admin-icon-192.png');
    assert.strictEqual(r8.status, 200);
    assert.strictEqual(r8.headers['content-type'], 'image/png');
    console.log('  ✓ [PASS] GET /admin-icon-192.png -> 200 OK image/png');

    // 8. Products API
    const r9 = await request('/api/products');
    assert.strictEqual(r9.status, 200);
    console.log('  ✓ [PASS] GET /api/products -> 200 OK (live catalog data)');

    console.log('\n🎉 ALL HTTP INTEGRATION TESTS PASSED!');
  } finally {
    serverProc.kill();
  }
}

runHttpTests().catch(err => {
  console.error('HTTP Test Failure:', err);
  process.exit(1);
});
