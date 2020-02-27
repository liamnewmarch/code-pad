import Vue from 'vue';
import Vuex from 'vuex';

import { firestore } from './firebase';

Vue.use(Vuex);

const defaults = {
  css: 'html {\n  background-color: #272822;\n  color: #fff;\n}\n',
  html: '<p> Hello, world! </p>\n',
  javascript: 'const p = document.querySelector(\'p\');\n',
  name: 'Untitled',
};

const state = {
  projects: {},
  user: {},
};

const mutations = {
  addProject(state, data) {
    Vue.set(state.projects, data.key, data);
  },
  deleteProject(state, data) {
    Vue.delete(state.projects, data.key);
  },
  setUser(state, user) {
    Vue.set(state, 'user', user);
  },
  setProject(state, { key, name, value }) {
    Vue.set(state.projects[key], name, value);
  },
};

const actions = {
  async addProject({ commit, state }, data = {}) {
    try {
      const doc = await firestore
          .collection('users')
          .doc(state.user.uid)
          .collection('projects')
          .add(data);
      const key = doc.id;
      await firestore
          .collection('users')
          .doc(state.user.uid)
          .collection('projects')
          .doc(key)
          .update({ key });
      commit('addProject', { ...defaults, ...data, key });
      return key;
    } catch ({ message }) {
      console.log(message);
    }
  },
  async deleteProject({ commit, state }, { key }) {
    try {
      commit('deleteProject', { key });
      await firestore
          .collection('users')
          .doc(state.user.uid)
          .collection('projects')
          .doc(key)
          .delete();
    } catch ({ message }) {
      console.log(message);
    }
  },
  async loadProjects({ commit }) {
    try {
      const projects = await firestore
          .collection('users')
          .doc(state.user.uid)
          .collection('projects')
          .get();
      for (const project of projects.docs) {
        commit('addProject', project.data());
      }
    } catch ({ message }) {
      console.log(message);
    }
  },
  setUser({ commit }, { uid }) {
    commit('setUser', { uid });
  },
  async updateProject({ commit, state }, { key, name, value }) {
    try {
      commit('setProject', { key, name, value });
      await firestore
          .collection('users')
          .doc(state.user.uid)
          .collection('projects')
          .doc(key)
          .update({ [name]: value });
    } catch ({ message }) {
      console.log(message);
    }
  },
};

export default new Vuex.Store({
  actions,
  mutations,
  state,
});
