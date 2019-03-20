import Vue from 'vue';
import Vuex from 'vuex';

import { loadState, saveState } from './persistance';

Vue.use(Vuex);

const createKey = () => Math.floor(new Date() / 1000).toString(36);

const defaults = {
  css: 'html {\n  background-color: #272822;\n  color: #fff;\n}\n',
  html: '<p> Hello, world! </p>\n',
  javascript: 'const p = document.querySelector(\'p\');\n',
  name: 'Untitled',
};

const state = loadState({
  projects: {},
  user: {},
});

const mutations = {
  addProject(state, data) {
    Vue.set(state.projects, data.key, data);
    saveState(state);
  },
  deleteProject(state, data) {
    Vue.delete(state.projects, data.key);
    saveState(state);
  },
  setProject(state, { key, name, value }) {
    Vue.set(state.projects[key], name, value);
    saveState(state);
  },
};

const actions = {
  addProject({ commit }, data = {}) {
    const key = createKey();
    commit('addProject', { ...defaults, ...data, key });
    return key;
  },
  deleteProject({ commit }, { key }) {
    commit('deleteProject', { key });
  },
  updateProject({ commit }, { key, name, value }) {
    commit('setProject', { key, name, value });
  },
};

export default new Vuex.Store({
  actions,
  mutations,
  state,
});
