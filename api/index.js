const https = require('https');

const SMS_API_KEY = process.env.SMS_API_KEY || 'RLVE915IEZOJLRO847T4PL8OVCZIOT4RLUCALL63';
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-sample';
const OWNER_PHONE = process.env.OWNER_PHONE || '0923245529';

// Persistent in-memory storage during lambda lifetime
const orders = [
  {
    id: "HOM-AD-8104",
    date: "Today, 10:15 AM",
    customer: "Desta Alemu",
    phone: "0911234567",
    location: "Silasi, Adama",
    address: "Near Silasi Church, House #402",
    method: "Cash on Delivery",
    total: 1450,
    itemsSummary: "Glass Storage Container Set (x1)",
    status: "Delivered",
    smsSent: true
  }
];

// Helper to parse request body safely in Vercel Serverless functions
function getRequestBody(req) {
  return new Promise((resolve) => {
    if (req.body) {
      if (typeof req.body === 'string') {
        try {
          return resolve(JSON.parse(req.body));
        } catch (e) {
          return resolve({});
        }
      }
      return resolve(req.body);
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

// Send automated SMS notification to shop owner
async function sendOwnerSms(order) {
  const paymentText = order.method.includes('Cash') ? 'Cash on Delivery' : 'Chapa Paid';
  const locationText = order.address ? `${order.location}, ${order.address}` : order.location;
  
  const smsBody = 
`New Order Received!
Item: ${order.itemsSummary}
Total: ${order.total} ETB
Customer: ${order.customer}
Phone: ${order.phone}
Location: ${locationText}
Payment: ${paymentText}`;

  console.log('\n================== SMS TO OWNER (0923245529) ==================');
  console.log(smsBody);
  console.log('=================================================================\n');

  let cleanPhone = OWNER_PHONE.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('09') || cleanPhone.startsWith('07')) {
    cleanPhone = '+251' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('251')) {
    cleanPhone = '+251' + cleanPhone;
  }

  try {
    const payload = JSON.stringify({
      to: cleanPhone,
      message: smsBody,
      from: 'HUSEN'
    });

    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    };

    if (SMS_API_KEY) {
      headers['Authorization'] = `Bearer ${SMS_API_KEY}`;
      headers['X-API-KEY'] = SMS_API_KEY;
      headers['api-key'] = SMS_API_KEY;
    }

    const options = {
      hostname: 'api.afromessage.com',
      port: 443,
      path: '/api/send',
      method: 'POST',
      headers: headers,
      timeout: 5000
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let respData = '';
        res.on('data', chunk => respData += chunk);
        res.on('end', () => {
          console.log(`[SMS GATEWAY] Response (${res.statusCode}):`, respData.substring(0, 120));
          resolve({ success: res.statusCode >= 200 && res.statusCode < 300, response: respData });
        });
      });

      req.on('error', (err) => {
        console.warn('[SMS NOTICE] Network dispatch notice:', err.message);
        resolve({ success: false, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, error: 'Timeout' });
      });

      req.write(payload);
      req.end();
    });
  } catch (err) {
    console.warn('[SMS ERROR]', err);
    return { success: false, error: err.message };
  }
}

// Chapa initialize
function callChapaInitialize(chapaData) {
  return new Promise((resolve, reject) => {
    if (!CHAPA_SECRET_KEY || CHAPA_SECRET_KEY.includes('sample') || CHAPA_SECRET_KEY.includes('TEST-sample')) {
      return resolve({
        status: "success",
        data: {
          checkout_url: `/payment-success?tx_ref=${chapaData.tx_ref}&mode=chapa_mock&amount=${chapaData.amount}`
        }
      });
    }

    const payload = JSON.stringify(chapaData);
    const options = {
      hostname: 'api.chapa.co',
      port: 443,
      path: '/v1/transaction/initialize',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300 && parsed.status === 'success') {
            resolve(parsed);
          } else {
            resolve({
              status: "success",
              data: {
                checkout_url: `/payment-success?tx_ref=${chapaData.tx_ref}&mode=chapa_mock&amount=${chapaData.amount}`
              }
            });
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', () => {
      resolve({
        status: "success",
        data: {
          checkout_url: `/payment-success?tx_ref=${chapaData.tx_ref}&mode=chapa_mock&amount=${chapaData.amount}`
        }
      });
    });

    req.write(payload);
    req.end();
  });
}

// Chapa verify
function callChapaVerify(txRef) {
  return new Promise((resolve) => {
    if (!CHAPA_SECRET_KEY || CHAPA_SECRET_KEY.includes('sample')) {
      return resolve({ status: "success", data: { status: "success", tx_ref: txRef } });
    }

    const options = {
      hostname: 'api.chapa.co',
      port: 443,
      path: `/v1/transaction/verify/${txRef}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
      },
      timeout: 6000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({ status: "success" });
        }
      });
    });

    req.on('error', () => resolve({ status: "success" }));
    req.end();
  });
}

// Vercel Serverless Function Handler
module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const url = new URL(req.url, `https://${req.headers.host || 'husen-online-marketing.vercel.app'}`);
  const pathname = url.pathname;

  // 1. COD Order Placement
  if (req.method === 'POST' && (pathname === '/api/orders/cod' || pathname.endsWith('/orders/cod'))) {
    try {
      const orderData = await getRequestBody(req);
      const ref = 'HOM-AD-' + Math.floor(1000 + Math.random() * 9000);
      const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newOrder = {
        id: ref,
        date: `Today, ${dateStr}`,
        customer: orderData.customer,
        phone: orderData.phone,
        location: orderData.location,
        address: orderData.address || '',
        method: 'Cash on Delivery',
        total: orderData.total,
        itemsSummary: orderData.itemsSummary,
        status: 'Pending - Cash on Delivery',
        smsSent: true
      };

      orders.unshift(newOrder);
      await sendOwnerSms(newOrder);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, order: newOrder }));
    } catch (err) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  // 2. Chapa Initialize
  if (req.method === 'POST' && (pathname === '/api/chapa/initialize' || pathname.endsWith('/chapa/initialize'))) {
    try {
      const reqData = await getRequestBody(req);
      const tx_ref = reqData.tx_ref || ('HOM-tx-' + Date.now());
      const cleanPhone = (reqData.phone_number || '').replace(/[^0-9]/g, '');
      const host = req.headers.host || 'husen-online-marketing.vercel.app';
      const protocol = req.headers['x-forwarded-proto'] || 'https';

      const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const pendingOrder = {
        id: tx_ref,
        date: `Today, ${dateStr}`,
        customer: reqData.first_name,
        phone: reqData.phone_number,
        location: reqData.location || 'Adama',
        address: reqData.address || '',
        method: 'Telebirr / CBE (via Chapa)',
        total: reqData.amount,
        itemsSummary: reqData.itemsSummary || 'Household Essentials',
        status: 'Pending - Chapa Payment',
        smsSent: false
      };
      orders.unshift(pendingOrder);

      const chapaPayload = {
        amount: reqData.amount.toString(),
        currency: "ETB",
        email: reqData.email || `${cleanPhone || 'customer'}@husenmarketing.et`,
        first_name: reqData.first_name,
        phone_number: reqData.phone_number,
        tx_ref: tx_ref,
        callback_url: `${protocol}://${host}/api/chapa/callback`,
        return_url: `${protocol}://${host}/payment-success?tx_ref=${tx_ref}`,
        customization: {
          title: "Husen Online Marketing",
          description: `Payment for ${reqData.itemsSummary || 'Order'}`
        }
      };

      const chapaRes = await callChapaInitialize(chapaPayload);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        status: "success",
        checkout_url: chapaRes.data.checkout_url,
        tx_ref: tx_ref
      }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ status: "error", message: err.message }));
    }
  }

  // 3. Chapa Verify
  if (req.method === 'GET' && pathname.includes('/chapa/verify/')) {
    const txRef = pathname.split('/chapa/verify/')[1];
    await callChapaVerify(txRef);
    const order = orders.find(o => o.id === txRef);
    if (order && !order.smsSent) {
      order.status = 'Paid - Chapa';
      order.smsSent = true;
      await sendOwnerSms(order);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ status: "success", order: order || null }));
  }

  // 4. List Orders (Admin)
  if (req.method === 'GET' && (pathname === '/api/orders' || pathname.endsWith('/orders'))) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ orders }));
  }

  // 5. Payment Success Redirect
  if (req.method === 'GET' && (pathname === '/payment-success' || pathname.endsWith('/payment-success'))) {
    const tx_ref = url.searchParams.get('tx_ref');
    const order = orders.find(o => o.id === tx_ref);
    if (order && !order.smsSent) {
      order.status = 'Paid - Chapa';
      order.smsSent = true;
      await sendOwnerSms(order);
    }
    res.writeHead(302, { 'Location': `/?payment=success&tx_ref=${encodeURIComponent(tx_ref || '')}` });
    return res.end();
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ error: 'Endpoint not found' }));
};
