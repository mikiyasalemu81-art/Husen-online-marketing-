const http = require('http');

const urls = [
  '/',
  '/style.css',
  '/app.js',
  '/public/images/logo.png',
  '/public/images/storage1.jpg',
  '/public/images/vest1.jpg',
  '/public/images/vest2.jpg',
  '/public/images/blender1.jpg',
  '/public/images/blender2.jpg',
  '/public/images/melanix.jpg'
];

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${url}`, (res) => {
      let size = 0;
      res.on('data', chunk => { size += chunk.length; });
      res.on('end', () => {
        resolve({ url, status: res.statusCode, contentType: res.headers['content-type'], size });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('--- TESTING HUSEN ONLINE MARKETING ENDPOINTS ---');
  let allGood = true;
  for (const u of urls) {
    try {
      const res = await checkUrl(u);
      console.log(`[${res.status}] ${u} - ${res.contentType} (${res.size} bytes)`);
      if (res.status !== 200 || res.size === 0) allGood = false;
    } catch (e) {
      console.error(`FAILED: ${u}`, e.message);
      allGood = false;
    }
  }
  if (allGood) {
    console.log('>>> ALL ASSETS AND PAGES ARE VERIFIED WORKING 100% <<<');
  } else {
    console.log('>>> SOME ASSETS FAILED <<<');
    process.exit(1);
  }
}

run();
