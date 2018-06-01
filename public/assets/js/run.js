const url = 'service-worker.js';

export async function run() {
  if (!navigator.serviceWorker) return;
  const registration = await navigator.serviceWorker.register(url);
  registration.update();
}
