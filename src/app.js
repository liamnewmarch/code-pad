import Vue from 'vue';

import { registerServiceWorker } from './config/service-worker';
import router from './config/router';
import store from './config/store';
import CodePad from './components/CodePad.vue';

new Vue({
  render: (h) => h(CodePad),
  router,
  store,
}).$mount('code-pad');

registerServiceWorker();
