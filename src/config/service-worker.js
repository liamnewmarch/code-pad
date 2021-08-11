const SERVICE_WORKER_URL = '/service-worker.js';

async function _register(url = SERVICE_WORKER_URL) {
  if ('serviceWorker' in navigator && navigator.onLine !== false) {
    const registration = await navigator.serviceWorker.register(url);
    registration.update();
  }
}

export function registerServiceWorker() {
  if ('requestIdleCallback' in window) {
    // Defer registration until the browser is idle
    requestIdleCallback(() => _register());
  } else {
    _register();
  }
}
