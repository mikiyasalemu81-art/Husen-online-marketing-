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
    phone: "0923456789",
    location: "Posta Bet, Adama",
    address: "House 204, 2nd Floor",
    total: 1450,
    itemsSummary: "Glass Storage Container Set (x1)"
  });

  console.log('COD Response Status:', codRes.status);
  console.log('COD Order Created:', codRes.body);

  if (codRes.status !== 200 || !codRes.body.success || codRes.body.order.status !== "Pending - Cash on Delivery") {
    console.error('FAILED: COD order placement failed');
    process.exit(1);
  }

  console.log('\n>>> 2. Testing Chapa Initialize (/api/chapa/initialize) <<<');
  const txRef = 'HOM-tx-' + Date.now();
  const chapaRes = await request('POST', '/api/chapa/initialize', {
    amount: 2850,
    currency: "ETB",
    email: "0911223344@husenmarketing.et",
    first_name: "Caaltuu Tolasaa",
    phone_number: "0911223344",
    location: "Silasi, Adama",
    address: "Near Sillaasee Church",
    tx_ref: txRef,
    itemsSummary: "Saachhi 2-in-1 Blender (x1)"
  });

  console.log('Chapa Init Status:', chapaRes.status);
  console.log('Chapa Init Response:', chapaRes.body);

  if (chapaRes.status !== 200 || chapaRes.body.status !== "success" || !chapaRes.body.checkout_url) {
    console.error('FAILED: Chapa initialization failed');
    process.exit(1);
  }

  console.log('\n>>> 3. Testing Chapa Verify (/api/chapa/verify/:tx_ref) <<<');
  const verifyRes = await request('GET', `/api/chapa/verify/${txRef}`);
  console.log('Verify Status:', verifyRes.status);
  console.log('Verify Response:', verifyRes.body);

  if (verifyRes.status !== 200 || !verifyRes.body.order || !verifyRes.body.order.status.includes('Paid')) {
    console.error('FAILED: Chapa verification failed');
    process.exit(1);
  }

  console.log('\n>>> 4. Testing Admin Orders List (/api/orders) <<<');
  const ordersRes = await request('GET', '/api/orders');
  console.log('Orders Count:', ordersRes.body.orders.length);
  console.log('Latest Orders:', ordersRes.body.orders.slice(0, 2));

  if (ordersRes.status !== 200 || ordersRes.body.orders.length < 2) {
    console.error('FAILED: Orders listing failed');
    process.exit(1);
  }

  console.log('\n>>> ALL ENDPOINTS & LOGIC VERIFIED SUCCESSFULLY! <<<');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
