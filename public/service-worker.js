const CACHE_VERSION = '3.0.5';

const CACHE_FILES = [
  // local resources
  '.',
  'assets/css/styles.css',
  'assets/css/_base.css',
  'assets/css/_fiddle.css',
  'assets/css/_menu.css',
  'assets/css/_start.css',
  'assets/css/_top-nav.css',
  'assets/css/_view.css',
  'assets/js/main.js',
  'assets/js/config.js',
  'assets/js/iframe.js',
  'assets/js/fiddle.js',
  'assets/js/view-controller.js',
  'index.html',
  // foreign resources
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.38.0/codemirror.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.38.0/codemirror.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.38.0/theme/monokai.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.38.0/mode/css/css.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.38.0/mode/htmlmixed/htmlmixed.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.38.0/mode/javascript/javascript.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.38.0/mode/xml/xml.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.0/angular.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-codemirror/0.3.0/ui-codemirror.js',
];

const STRATEGY = {
  async addFiles() {
    const cache = await caches.open(CACHE_VERSION);
    return cache.addAll(CACHE_FILES);
  },

  async deleteStale() {
    const staleCaches = (key) => key !== CACHE_VERSION;
    const deleteCaches = (key) => caches.delete(key);
    const keys = await caches.keys();
    return Promise.all(keys.filter(staleCaches).map(deleteCaches));
  },

  async respondFromCache(event) {
    const response = await caches.match(event.request);
    return response || fetch(event.request);
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
  const response = STRATEGY.respondFromCache(event);
  event.respondWith(response);
});
