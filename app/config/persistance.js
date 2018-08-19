import getLegacy from './migrate';

const SERVICE_WORKER_URL = '/service-worker.js';
const STORAGE_KEY = 'fiddle-store';

export function loadState(defaults) {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    const state = { ...defaults, ...getLegacy(), ...JSON.parse(json) };
    return saveState(state);
  } catch (error) {
    return defaults;
  }
}

export function saveState(state) {
  const json = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, json);
  return state;
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && navigator.onLine) {
    navigator.serviceWorker.register(SERVICE_WORKER_URL).then(registration => {
      registration.update();
    });
  }
}
