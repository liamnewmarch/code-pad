import 'babel-polyfill';

import Vue from 'Vue';

import { registerServiceWorker } from './config/persistance';
import router from './config/router';
import store from './config/store';
import App from './components/App';

new Vue({
  el: 'FiddleApp',
  render: h => h(App),
  router,
  store,
});

registerServiceWorker();
