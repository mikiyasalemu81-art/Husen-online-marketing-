const http = require('http');

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('>>> 1. Testing Cash on Delivery (/api/orders/cod) <<<');
  const codRes = await request('POST', '/api/orders/cod', {
    customer: "Abebe Kebede",
    phone: "923456789", // Clean 9-digit Ethiopian phone
    location: "Posta Bet, Adama",
    address: "House 204, 2nd Floor",
    total: 1450,
    itemsSummary: "Glass Storage Container Set (Qty: 1)"
  });

  console.log('COD Response Status:', codRes.status);
  console.log('COD Order Created:', codRes.body);

  if (codRes.status !== 200 || !codRes.body.success || codRes.body.order.status !== "Pending - Cash on Delivery") {
    console.error('FAILED: COD order placement failed');
    process.exit(1);
  }

  console.log('\n>>> 2. Testing Manual Direct Transfer (/api/orders/manual) <<<');
  const manualRes = await request('POST', '/api/orders/manual', {
    customer: "Tolasaa Gudeta",
    phone: "0912345678", // Auto formats leading 0
    location: "Gendahara, Adama",
    address: "Near High School",
    method: "Manual CBE",
    total: 1200,
    itemsSummary: "Posture Corrector Compression Vest (Qty: 1)"
  });

  console.log('Manual Order Status:', manualRes.status);
  console.log('Manual Order Created:', manualRes.body);

  if (manualRes.status !== 200 || !manualRes.body.success || manualRes.body.order.status !== "Pending - Manual Transfer Verification") {
    console.error('FAILED: Manual transfer order placement failed');
    process.exit(1);
  }

  console.log('\n>>> 3. Testing Chapa Initialize (/api/chapa/initialize) <<<');
  const txRef = 'HOM-tx-' + Date.now();
  const chapaRes = await request('POST', '/api/chapa/initialize', {
    amount: 2850,
    currency: "ETB",
    email: "0911223344@husenmarketing.et",
    first_name: "Caaltuu Tolasaa",
    phone_number: "911223344",
    location: "Silasi, Adama",
    address: "Near Sillaasee Church",
    tx_ref: txRef,
    itemsSummary: "Saachhi 2-in-1 Blender (Qty: 1)"
  });

  console.log('Chapa Init Status:', chapaRes.status);
  console.log('Chapa Init Response:', chapaRes.body);

  if (chapaRes.status !== 200 || chapaRes.body.status !== "success" || !chapaRes.body.checkout_url) {
    console.error('FAILED: Chapa initialization failed');
    process.exit(1);
  }

  console.log('\n>>> 4. Testing Chapa Verify (/api/chapa/verify/:tx_ref) <<<');
  const verifyRes = await request('GET', `/api/chapa/verify/${txRef}`);
  console.log('Verify Status:', verifyRes.status);
  console.log('Verify Response:', verifyRes.body);

  if (verifyRes.status !== 200 || !verifyRes.body.order || !verifyRes.body.order.status.includes('Paid')) {
    console.error('FAILED: Chapa verification failed');
    process.exit(1);
  }

  console.log('\n>>> 5. Testing Persistent Products CRUD (/api/products) <<<');
  const getProds = await request('GET', '/api/products');
  console.log('Initial Products Count:', getProds.body.products.length);
  if (getProds.status !== 200 || !getProds.body.success) {
    console.error('FAILED: Could not fetch products');
    process.exit(1);
  }

  // Create test product
  const newProdId = 'test-prod-' + Date.now();
  const createProdRes = await request('POST', '/api/products', {
    id: newProdId,
    name: "Test Solar Lamp",
    category: "home",
    price: 850,
    inStock: true,
    images: ["public/images/storage1.jpg"]
  });
  console.log('Created Product Status:', createProdRes.status);
  if (createProdRes.status !== 201 || !createProdRes.body.product) {
    console.error('FAILED: Product creation failed');
    process.exit(1);
  }

  // Update test product (stock toggle & price)
  const updateProdRes = await request('PUT', `/api/products/${newProdId}`, {
    price: 900,
    inStock: false
  });
  console.log('Updated Product Status:', updateProdRes.status);
  if (updateProdRes.status !== 200 || updateProdRes.body.product.inStock !== false) {
    console.error('FAILED: Product update failed');
    process.exit(1);
  }

  // Delete test product
  const delProdRes = await request('DELETE', `/api/products/${newProdId}`);
  console.log('Deleted Product Status:', delProdRes.status);
  if (delProdRes.status !== 200) {
    console.error('FAILED: Product deletion failed');
    process.exit(1);
  }

  console.log('\n>>> 6. Testing Payment Accounts Settings (/api/settings) <<<');
  const settingsRes = await request('GET', '/api/settings');
  console.log('Current Settings:', settingsRes.body.settings);
  if (settingsRes.status !== 200 || settingsRes.body.settings.cbeAccount !== '1000123456789') {
    console.error('FAILED: Settings verification failed');
    process.exit(1);
  }

  console.log('\n>>> 7. Testing Admin Orders List (/api/orders) <<<');
  const ordersRes = await request('GET', '/api/orders');
  console.log('Orders Count:', ordersRes.body.orders.length);
  if (ordersRes.status !== 200 || ordersRes.body.orders.length < 3) {
    console.error('FAILED: Orders listing failed');
    process.exit(1);
  }

  console.log('\n>>> ALL 7 ENDPOINTS & LOGIC VERIFIED SUCCESSFULLY! <<<');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
