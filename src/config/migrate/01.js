import store from '../store';

const STORAGE_KEY = 'fiddles';

const load = (key) => JSON.parse(localStorage.getItem(key));

export function count() {
  if (!(STORAGE_KEY in localStorage)) return 0;
  return load(STORAGE_KEY).length;
}

export async function migrate() {
  if (!(STORAGE_KEY in localStorage)) return;
  for (const key of load(STORAGE_KEY)) {
    const project = load(key);
    delete project.key;
    await store.dispatch('addProject', project);
    localStorage.removeItem(project.key);
  }
  localStorage.removeItem(STORAGE_KEY);
}
