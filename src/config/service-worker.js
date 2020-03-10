const SERVICE_WORKER_URL = '/service-worker.js';

export default async function() {
  if ('serviceWorker' in navigator && navigator.onLine !== false) {
    const registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL);
    registration.update();
  }
}
