const handler = require('./api/index.js');
const http = require('http');

async function runEndpointTests() {
  console.log('Testing api/index.js directly...\n');

  function fakeReqRes(method, url, body) {
    return new Promise((resolve) => {
      const listeners = {};
      const req = {
        method,
        url,
        headers: { host: 'localhost:3000' },
        on: (event, cb) => { listeners[event] = cb; },
        body
      };

      let statusCode = 200;
      let headers = {};
      let responseBody = '';

      const res = {
        setHeader: (k, v) => { headers[k] = v; },
        status: (code) => {
          statusCode = code;
          return res;
        },
        json: (data) => {
          responseBody = JSON.stringify(data);
          resolve({ statusCode, data, headers });
        },
        send: (msg) => {
          responseBody = msg;
          resolve({ statusCode, body: msg, headers });
        },
        writeHead: (code, hdrs) => {
          statusCode = code;
          headers = { ...headers, ...hdrs };
        },
        end: (data) => {
          if (data) responseBody = data;
          resolve({ statusCode, body: responseBody, headers });
        }
      };

      handler(req, res);
    });
  }

  // 1. Test Admin Auth
  const authGood = await fakeReqRes('POST', '/api/admin/verify', { password: 'husenonlinemarketing1234' });
  console.log('Admin Auth (Correct):', authGood.statusCode === 200 && authGood.data.success ? '✅ PASS' : '❌ FAIL');

  const authBad = await fakeReqRes('POST', '/api/admin/verify', { password: 'wrong' });
  console.log('Admin Auth (Incorrect):', authBad.statusCode === 401 ? '✅ PASS' : '❌ FAIL');

  // 2. Test COD Order
  const codOrder = await fakeReqRes('POST', '/api/orders/cod', {
    customer: 'Desta Alemu',
    phone: '0912345678',
    location: 'Adama Posta Bet',
    address: 'Building A',
    total: 1450,
    itemsSummary: 'Glass Storage Container Set (Qty: 1)'
  });
  console.log('COD Order Placed:', codOrder.statusCode === 200 && codOrder.data.success ? '✅ PASS' : '❌ FAIL');

  // 3. Test Manual Order
  const manualOrder = await fakeReqRes('POST', '/api/orders/manual', {
    customer: 'Hanna Bekele',
    phone: '0922334455',
    location: 'Silasi',
    method: 'Manual Telebirr',
    total: 950,
    itemsSummary: 'Melanix (Qty: 1)'
  });
  console.log('Manual Order Placed:', manualOrder.statusCode === 200 && manualOrder.data.success ? '✅ PASS' : '❌ FAIL');

  // 4. Test Chapa Initialize
  const chapaInit = await fakeReqRes('POST', '/api/chapa/initialize', {
    amount: 1200,
    first_name: 'Desta Alemu',
    phone_number: '0912345678',
    location: 'Adama',
    itemsSummary: 'Posture Corrector'
  });
  console.log('Chapa Initialize (checkout_url returned):', chapaInit.statusCode === 200 && chapaInit.data.checkout_url ? '✅ PASS' : '❌ FAIL');

  // 5. Test Chapa Verify
  if (chapaInit.data && chapaInit.data.tx_ref) {
    const chapaVerify = await fakeReqRes('GET', `/api/chapa/verify/${chapaInit.data.tx_ref}`);
    console.log('Chapa Verify Callback:', chapaVerify.statusCode === 200 && chapaVerify.data.status === 'success' ? '✅ PASS' : '❌ FAIL');
  }

  // 6. Test Product Stock Update
  const stockUpdate = await fakeReqRes('PUT', '/api/products/prod-1', { inStock: false });
  console.log('Product Stock Toggle (PUT):', stockUpdate.statusCode === 200 && stockUpdate.data.product.inStock === false ? '✅ PASS' : '❌ FAIL');

  // Re-enable stock
  await fakeReqRes('PUT', '/api/products/prod-1', { inStock: true });

  console.log('\nAll direct API integration tests finished!');
}

runEndpointTests();
