import Vue from 'vue';
import VueRouter from 'vue-router';

import Editor from '../components/Editor.vue';
import ImportExport from '../components/ImportExport.vue';
import List from '../components/List.vue';
import Project from '../components/Project.vue';
import Result from '../components/Result.vue';
import Settings from '../components/Settings.vue';

Vue.use(VueRouter);

const routes = [{
  component: List,
  name: 'list',
  path: '/',
}, {
  component: ImportExport,
  name: 'import-export',
  path: '/import-export',
}, {
  component: Project,
  name: 'project',
  path: '/project/:key',
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
