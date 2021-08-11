const CACHE_VERSION = 'VERSION';

const CACHE_FILES = [
  '.',
  'bundle.css',
  'bundle.js',
  'icon-192.png',
  'index.html',
];

const STRATEGY = {
  async addFiles() {
    const cache = await caches.open(CACHE_VERSION);
    return cache.addAll(CACHE_FILES);
  },

  async deleteStale() {
    const keys = await caches.keys();
    for (const key of keys) {
      if (key !== CACHE_FILES) {
        await caches.delete(key);
      }
    }
  },

  async respondFromCache(event) {
    try {
      const response = await caches.match(event.request);
      return response || await fetch(event.request);
    } catch (error) {
      return caches.match('/');
    }
  },
};

self.addEventListener('activate', (event) => {
  const deleted = STRATEGY.deleteStale();
  event.waitUntil(deleted);
});

self.addEventListener('install', (event) => {
  const added = STRATEGY.addFiles();
  event.waitUntil(added);
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(location.origin)) {
    const response = STRATEGY.respondFromCache(event);
    event.respondWith(response);
  }
});
