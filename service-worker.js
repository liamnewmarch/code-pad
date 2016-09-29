const cacheVersion = '1.0.0';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheVersion).then(cache => {
    return cache.addAll([
      '.',
      'index.html',
      'assets/js/main.js',
      'assets/css/styles.css',
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
    ]);
  }));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => {
    return response || fetch(event.request);
  }));
});
