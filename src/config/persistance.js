import { getLegacy } from './migrate';

const SERVICE_WORKER_URL = '/service-worker.js';
const STORAGE_KEY = 'project-store';

export function saveState(state) {
  const json = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, json);
  return state;
}

export function loadState(defaults) {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    const state = { ...defaults, ...getLegacy(), ...JSON.parse(json) };
    return saveState(state);
  } catch (error) {
    return defaults;
  }
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator && navigator.onLine) {
    const registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL);
    registration.update();
  }
}
