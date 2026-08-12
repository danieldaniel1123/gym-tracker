const CACHE = 'gymtracker-v3';
const STATIC = [
  '/',
  '/index.html',
  '/style.css',
  '/app-data.js',
  '/app-core.js',
  '/app-history.js',
  '/app-gps.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC).catch(()=>{}))
  );
  // Take control immediately — don't wait for old SW to die
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Delete ALL old caches
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('Deleting old cache:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Always go network-first for Supabase, CDN scripts, and our own JS/HTML
  const isNetworkFirst =
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('jsdelivr.net') ||
    url.hostname.includes('unpkg.com') ||
    url.hostname.includes('openstreetmap.org') ||
    e.request.url.endsWith('.js') ||
    e.request.url.endsWith('.html');

  if (isNetworkFirst) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          // Update cache with fresh version
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(cache => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for everything else (CSS, images, fonts)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
