import Vue from 'vue';

export function addProject(state, data) {
  Vue.set(state.projects, data.key, data);
}

export function deleteProject(state, data) {
  Vue.delete(state.projects, data.key);
}

export function loaded(state) {
  Vue.set(state, 'loading', false);
}

export function setUser(state, user) {
  Vue.set(state, 'user', user);
}

export function setProject(state, { key, name, value }) {
  Vue.set(state.projects[key], name, value);
}
