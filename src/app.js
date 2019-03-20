import 'babel-polyfill';

import Vue from 'vue';

import { registerServiceWorker } from './config/persistance';
import router from './config/router';
import store from './config/store';
import App from './components/App.vue';

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('FiddleApp');

registerServiceWorker();
