import Vue from 'vue';

import { auth } from './config/firebase.js';
import { registerServiceWorker } from './config/persistance';
import router from './config/router';
import store from './config/store';
import App from './components/App.vue';

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('code-pad');

registerServiceWorker();

auth.onAuthStateChanged(async (user) => {
  try {
    store.dispatch('setUser', user);
  } catch ({ message }) {
    console.error(message);
  }
});
