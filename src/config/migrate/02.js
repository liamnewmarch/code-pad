import store from '../store';

const STORAGE_KEY = 'project-store';

const load = key => JSON.parse(localStorage.getItem(key));

export default async function() {
  if (!localStorage.hasItem(STORAGE_KEY)) return;
  const { projects } = load(STORAGE_KEY);
  for (const project of Object.values(projects)) {
    delete project.key;
    await store.dispatch('addProject', project);
  }
  localStorage.removeItem(STORAGE_KEY);
}
