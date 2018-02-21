const CACHE_VERSION = '1.1.0';

const CACHE_FILES = [
  '.',
  'index.html',
  'assets/js/main.js',
  'assets/css/styles.css',
  'assets/css/_base.css',
  'assets/css/_fiddle.css',
  'assets/css/_menu.css',
  'assets/css/_start.css',
  'assets/css/_top-nav.css',
  'assets/css/_view.css',
  'bower_components/codemirror/lib/codemirror.css',
  'bower_components/codemirror/lib/codemirror.js',
  'bower_components/codemirror/theme/monokai.css',
  'bower_components/codemirror/mode/css/css.js',
  'bower_components/codemirror/mode/htmlmixed/htmlmixed.js',
  'bower_components/codemirror/mode/javascript/javascript.js',
  'bower_components/codemirror/mode/xml/xml.js',
  'bower_components/angular/angular.min.js',
  'bower_components/angular-sanitize/angular-sanitize.min.js',
  'bower_components/angular-ui-codemirror/ui-codemirror.min.js',
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
});

self.addEventListener('fetch', (event) => {
  const response = STRATEGY.respondFromCache(event);
  event.respondWith(response);
});
