import store from '../store';

const STORAGE_KEY = 'project-store';

const load = key => JSON.parse(localStorage.getItem(key));

export function count() {
  if (!(STORAGE_KEY in localStorage)) return;
  const { projects } = load(STORAGE_KEY);
  return Object.values(projects).length;
}

export async function migrate() {
  if (!(STORAGE_KEY in localStorage)) return;
  const { projects } = load(STORAGE_KEY);
  for (const project of Object.values(projects)) {
    delete project.key;
    await store.dispatch('addProject', project);
  }
  localStorage.removeItem(STORAGE_KEY);
}
