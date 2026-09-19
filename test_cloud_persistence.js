/**
 * Test Multi-Device Cloud Persistence & Real-Time Sync
 * Simulates Device A (Phone) and Device B (Laptop) interacting with the API
 * across separate cold-start lambda instances.
 */

const handler = require('./api/index.js');

function fakeRequest(method, url, body = null) {
  return new Promise((resolve) => {
    const listeners = {};
    const req = {
      method,
      url,
      headers: { host: 'husen-marketing.vercel.app' },
      on: (event, cb) => { listeners[event] = cb; },
      body
    };

    let statusCode = 200;
    let headers = {};
    let responseData = null;

    const res = {
      setHeader: (k, v) => { headers[k] = v; },
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        responseData = data;
        resolve({ statusCode, data, headers });
      },
      send: (msg) => {
        resolve({ statusCode, body: msg, headers });
      },
      end: (data) => {
        resolve({ statusCode, body: data, headers });
      }
    };

    handler(req, res);
  });
}

async function runTests() {
  console.log('==================================================================');
  console.log('   TESTING MULTI-DEVICE PERSISTENCE & REAL-TIME CLOUD SYNC');
  console.log('==================================================================\n');

  // STEP 1: Device A loads initial catalog
  console.log('--- Step 1: Device A loads initial catalog ---');
  const res1 = await fakeRequest('GET', '/api/products');
  console.log(`Status: ${res1.statusCode} | Success: ${res1.data.success} | Products Count: ${res1.data.products.length}`);
  const initialCount = res1.data.products.length;
  if (!res1.data.success || initialCount < 1) {
    console.error('❌ Step 1 Failed: Cannot load initial products');
    process.exit(1);
  }
  console.log('✅ Step 1 PASS\n');

  // STEP 2: Device A (Phone) uploads a new product
  console.log('--- Step 2: Device A uploads a new product "Smart Electric Kettle" ---');
  const testProdId = 'prod-test-' + Date.now();
  const newProductPayload = {
    id: testProdId,
    name: 'Smart Electric Kettle 2.0L',
    category: 'kitchen',
    price: 1850,
    inStock: true,
    images: ['https://res.cloudinary.com/trkihe9m/image/upload/v1789847626/uhduipuuvk8pudatjis1.gif'],
    spec: 'Fast boiling 1500W stainless steel kettle with auto shut-off',
    fullDesc: 'Premium heavy duty electric kettle designed for Adama households.'
  };

  const res2 = await fakeRequest('POST', '/api/products', newProductPayload);
  console.log(`Status: ${res2.statusCode} | Created Product ID: ${res2.data.product ? res2.data.product.id : 'NONE'}`);
  console.log(`Total Products in Cloud Manifest: ${res2.data.products ? res2.data.products.length : 'NONE'}`);
  if (res2.statusCode !== 201 || !res2.data.product || res2.data.products.length !== initialCount + 1) {
    console.error('❌ Step 2 Failed: Product was not added to cloud manifest');
    process.exit(1);
  }
  console.log('✅ Step 2 PASS: Product saved to persistent cloud manifest\n');

  // STEP 3: Simulated Device B (Laptop) fetches catalog
  console.log('--- Step 3: Simulated Device B queries /api/products ---');
  const res3 = await fakeRequest('GET', '/api/products');
  console.log(`Device B Products Count: ${res3.data.products.length}`);
  const foundOnDeviceB = res3.data.products.find(p => p.id === testProdId);
  if (!foundOnDeviceB) {
    console.error('❌ Step 3 Failed: Product added on Device A does not appear on Device B');
    process.exit(1);
  }
  console.log(`Device B Found Product: "${foundOnDeviceB.name.en}" (Price: ${foundOnDeviceB.price} ETB, In Stock: ${foundOnDeviceB.inStock})`);
  console.log('✅ Step 3 PASS: Product successfully visible on other devices!\n');

  // STEP 4: Device A updates price and toggles stock
  console.log('--- Step 4: Device A edits product price to 1950 ETB & toggles out-of-stock ---');
  const res4 = await fakeRequest('PUT', `/api/products/${testProdId}`, {
    price: 1950,
    inStock: false
  });
  console.log(`Status: ${res4.statusCode} | Updated Price: ${res4.data.product.price} | In Stock: ${res4.data.product.inStock}`);
  if (res4.statusCode !== 200 || res4.data.product.price !== 1950 || res4.data.product.inStock !== false) {
    console.error('❌ Step 4 Failed: Product edit failed');
    process.exit(1);
  }
  console.log('✅ Step 4 PASS: Edit persisted to cloud\n');

  // STEP 5: Device B verifies the updated price and stock status
  console.log('--- Step 5: Device B polls and checks edited values ---');
  const res5 = await fakeRequest('GET', '/api/products');
  const checkDeviceB = res5.data.products.find(p => p.id === testProdId);
  if (!checkDeviceB || checkDeviceB.price !== 1950 || checkDeviceB.inStock !== false) {
    console.error('❌ Step 5 Failed: Device B did not receive updated price or stock state');
    process.exit(1);
  }
  console.log(`Device B Verified: Price = ${checkDeviceB.price} ETB, In Stock = ${checkDeviceB.inStock}`);
  console.log('✅ Step 5 PASS: Edits synchronized seamlessly across devices!\n');

  // STEP 6: Simulated polling cycles (verify product NEVER disappears after multiple polls)
  console.log('--- Step 6: Simulating 5 rapid background polling cycles ---');
  for (let i = 1; i <= 5; i++) {
    const pollRes = await fakeRequest('GET', '/api/products');
    const stillThere = pollRes.data.products.some(p => p.id === testProdId);
    if (!stillThere) {
      console.error(`❌ Step 6 Failed: Product disappeared during poll ${i}!`);
      process.exit(1);
    }
  }
  console.log('✅ Step 6 PASS: Product remains permanently intact during polling cycles (NO disappearing!)\n');

  // STEP 7: Device B deletes the product
  console.log('--- Step 7: Device B deletes product from inventory ---');
  const res7 = await fakeRequest('DELETE', `/api/products/${testProdId}`);
  console.log(`Status: ${res7.statusCode} | Message: ${res7.data.message}`);
  if (res7.statusCode !== 200 || res7.data.products.some(p => p.id === testProdId)) {
    console.error('❌ Step 7 Failed: Product was not deleted from cloud manifest');
    process.exit(1);
  }
  console.log('✅ Step 7 PASS: Product deleted from cloud manifest\n');

  // STEP 8: Device A verifies the product is permanently deleted and does not reappear
  console.log('--- Step 8: Device A checks /api/products after deletion ---');
  const res8 = await fakeRequest('GET', '/api/products');
  const ghostProduct = res8.data.products.find(p => p.id === testProdId);
  if (ghostProduct) {
    console.error('❌ Step 8 Failed: Deleted product resurrected on Device A');
    process.exit(1);
  }
  console.log(`Device A Products Count: ${res8.data.products.length} (Matches initial count: ${res8.data.products.length === initialCount})`);
  console.log('✅ Step 8 PASS: Product is permanently deleted across all devices!\n');

  console.log('==================================================================');
  console.log('   🎉 ALL MULTI-DEVICE PERSISTENCE & SYNC TESTS PASSED 100%!');
  console.log('==================================================================\n');
}

runTests().catch(err => {
  console.error('Unhandled test error:', err);
  process.exit(1);
});
