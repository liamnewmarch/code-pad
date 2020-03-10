import store from '../store';

const STORAGE_KEY = 'fiddles';

const load = key => JSON.parse(localStorage.getItem(key));

export default async function() {
  if (!localStorage.hasItem(STORAGE_KEY)) return;
  for (const key of load(STORAGE_KEY)) {
    const project = load(key);
    delete project.key;
    await store.dispatch('addProject', project);
    localStorage.removeItem(project.key);
  }
  localStorage.removeItem(STORAGE_KEY);
}
