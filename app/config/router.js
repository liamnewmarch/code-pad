import Vue from 'Vue';
import VueRouter from 'vue-router';

import Editor from '../components/Editor';
import Fiddle from '../components/Fiddle';
import List from '../components/List';
import Result from '../components/Result';
import Settings from '../components/Settings';

Vue.use(VueRouter);

const routes = [{
  component: List,
  name: 'list',
  path: '/',
}, {
  component: Fiddle,
  name: 'fiddle',
  path: '/fiddle/:key',
  children: [{
    component: Editor,
    name: 'editor',
    path: 'editor/:type',
  }, {
    component: Result,
    name: 'result',
    path: 'result',
  }, {
    component: Settings,
    name: 'settings',
    path: 'settings',
  }],
}];

export default new VueRouter({
  mode: 'history',
  routes,
});
