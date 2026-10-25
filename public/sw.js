/**
 * Husen Online Marketing — Progressive Web App Service Worker
 * Version: 1.0.0
 * 
 * Strategy:
 * - App Shell: Pre-cached during install for instant loading & offline readiness
 * - Product Catalog & Settings: Network-first with cache fallback (prices and stock stay 100% fresh)
 * - Static Assets & Cloudinary Images: Cache-first with network fallback
 * - Admin, Payment, & Orders: NEVER cached (always live network)
 * - Navigation Fallback: Cached shell or friendly /offline.html
 */

const CACHE_NAME = 'husen-app-shell-v1';
const DATA_CACHE_NAME = 'husen-data-v1';
const STATIC_CACHE_NAME = 'husen-static-v1';

const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/style.css?v=2.2',
  '/style.css',
  '/app.js',
  '/manifest.webmanifest',
  '/site.webmanifest',
  '/offline.html',
  '/public/images/logo.png',
  '/favicon-192x192.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap'
];

// 1. Service Worker Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Pre-caching App Shell files...');
      for (const url of APP_SHELL_FILES) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('[SW] Failed to pre-cache item:', url, err);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// 2. Service Worker Activate
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, DATA_CACHE_NAME, STATIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Helper to detect routes that must NEVER be cached
function isExcludedFromCache(url, method) {
  if (method !== 'GET') return true;

  const pathname = url.pathname;
  if (
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/api/chapa') ||
    pathname.startsWith('/api/orders') ||
    pathname.startsWith('/payment-success') ||
    pathname.startsWith('/admin') ||
    url.search.includes('payment=') ||
    url.search.includes('tx_ref=')
  ) {
    return true;
  }
  return false;
}

// 4. Helper to detect static assets & Cloudinary images
function isStaticOrImage(url) {
  const href = url.href;
  const pathname = url.pathname;
  
  if (url.hostname.includes('cloudinary.com') || href.includes('res.cloudinary.com')) {
    return true;
  }
  if (url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('fonts.googleapis.com')) {
    return true;
  }
  if (url.hostname.includes('telegram.org')) {
    return true;
  }
  if (/\.(png|jpe?g|gif|webp|svg|ico|woff2?|ttf|css)$/i.test(pathname)) {
    return true;
  }
  return false;
}

// 5. Service Worker Fetch Handling
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Exclude non-GET and Admin / Payment / Order APIs
  if (isExcludedFromCache(url, request.method)) {
    return; // Pass through to live network directly
  }

  // Network-First for Product Data & Store Settings (Keep stock and prices fresh)
  if (url.pathname === '/api/products' || url.pathname === '/api/settings') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(DATA_CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            return new Response(JSON.stringify([]), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Navigation Requests: HTML pages
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const indexMatch = await caches.match('/index.html');
          if (indexMatch) return indexMatch;
          const offlineMatch = await caches.match('/offline.html');
          if (offlineMatch) return offlineMatch;
          return new Response('Offline - Husen Online Marketing', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // Cache-First for Static Assets, Fonts & Cloudinary Images
  if (isStaticOrImage(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch((err) => {
          console.warn('[SW] Fetch failed for static asset:', request.url, err);
          return cachedResponse;
        });
      })
    );
    return;
  }

  // Default: Stale-While-Revalidate for app shell scripts and styles
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
