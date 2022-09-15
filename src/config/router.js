import Vue from 'vue';
import VueRouter from 'vue-router';

import CodeEditor from '../components/CodeEditor.vue';
import GlobalSettings from '../components/GlobalSettings.vue';
import ProjectList from '../components/ProjectList.vue';
import ProjectLoader from '../components/ProjectLoader.vue';
import ProjectPreview from '../components/ProjectPreview.vue';
import ProjectSettings from '../components/ProjectSettings.vue';

Vue.use(VueRouter);

const routes = [{
  component: ProjectList,
  name: 'list',
  path: '/',
}, {
  component: GlobalSettings,
  name: 'global-settings',
  path: '/settings',
}, {
  component: ProjectLoader,
  name: 'project',
  path: '/project/:key',
  children: [{
    component: CodeEditor,
    name: 'editor',
    path: 'editor/:type',
  }, {
    component: ProjectPreview,
    name: 'result',
    path: 'result',
  }, {
    component: ProjectSettings,
    name: 'project-settings',
    path: 'settings',
  }],
}];

export default new VueRouter({
  mode: 'history',
  routes,
});
