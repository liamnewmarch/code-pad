import Vue from 'Vue';
import Vuex from 'Vuex';

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
  fiddles: {},
  user: {},
});

const mutations = {
  addFiddle(state, data) {
    Vue.set(state.fiddles, data.key, data);
    saveState(state);
  },
  deleteFiddle(state, data) {
    Vue.delete(state.fiddles, data.key);
    saveState(state);
  },
  setFiddle(state, { key, name, value }) {
    Vue.set(state.fiddles[key], name, value);
    saveState(state);
  },
};

const actions = {
  addFiddle({ commit }, data = {}) {
    commit('addFiddle', {
      ...defaults,
      ...data,
      key: createKey(),
    });
  },
  deleteFiddle({ commit }, { key }) {
    commit('deleteFiddle', { key });
  },
  updateFiddle({ commit }, { key, name, value }) {
    commit('setFiddle', { key, name, value });
  },
};

export default new Vuex.Store({
  actions,
  mutations,
  state,
});
