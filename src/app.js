import Vue from 'vue';

import register from './config/service-worker';
import router from './config/router';
import store from './config/store';
import App from './components/App.vue';

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('code-pad');

register();
