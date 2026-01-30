const CACHE_NAME = 'roket-alien-v3';

// Daftar file yang perlu di-cache agar bisa offline
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Event Install: Menyimpan file ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // Force activate
  self.skipWaiting();
});

// Event Activate: Membersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Event Fetch: Menangani request agar offline-ready
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});