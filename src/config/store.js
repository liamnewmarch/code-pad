import { createPinia, defineStore } from 'pinia';

import firebase, { auth, firestore, resolveOffline } from './firebase.js';

export const pinia = createPinia();

const defaultData = {
  css: 'html {\n  background-color: #111;\n  color: #fff;\n}\n',
  html: '<p> Hello, world! </p>\n',
  javascript: 'const p = document.querySelector(\'p\');\n',
  name: 'Untitled',
};

export const useProjectStore = defineStore('projects', {
  state: () => ({
    loading: true,
    projects: {},
    user: null,
  }),
  actions: {
    init() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.user = user;
          this.loadProjects();
        } else {
          this.user = null;
          this.loading = false;
        }
      });
    },
    async loadProjects() {
      try {
        const result = await resolveOffline(firestore
            .collection('users')
            .doc(this.user.uid)
            .collection('projects')
            .get());
        if (result && result.docs) {
          for (const doc of result.docs) {
            this.projects[doc.id] = { ...doc.data(), key: doc.id };
          }
        }
        this.loading = false;
      } catch ({ message }) {
        console.log(message);
      }
    },
    async addProject(data = defaultData) {
      try {
        const project = { ...data };
        project.created = project.updated = firebase.firestore.Timestamp.now();
        const doc = await resolveOffline(firestore
            .collection('users')
            .doc(this.user.uid)
            .collection('projects')
            .add(project));
        this.projects[doc.id] = { ...project, key: doc.id };
        return doc.id;
      } catch ({ message }) {
        console.log(message);
      }
    },
    async deleteProject({ key }) {
      try {
        await resolveOffline(firestore
            .collection('users')
            .doc(this.user.uid)
            .collection('projects')
            .doc(key)
            .delete());
        delete this.projects[key];
      } catch ({ message }) {
        console.log(message);
      }
    },
    async updateProject({ key, name, value }) {
      try {
        this.projects[key][name] = value;
        await resolveOffline(firestore
            .collection('users')
            .doc(this.user.uid)
            .collection('projects')
            .doc(key)
            .update({
              [name]: value,
              updated: firebase.firestore.Timestamp.now(),
            }));
      } catch ({ message }) {
        console.log(message);
      }
    },
    signIn() {
      auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    },
    signOut() {
      auth.signOut();
    },
  },
});
