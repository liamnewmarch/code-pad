import Vue from 'vue';
import VueRouter from 'vue-router';

import Editor from '../components/Editor.vue';
import GlobalSettings from '../components/GlobalSettings.vue';
import List from '../components/List.vue';
import Project from '../components/Project.vue';
import Result from '../components/Result.vue';
import ProjectSettings from '../components/ProjectSettings.vue';

Vue.use(VueRouter);

const routes = [{
  component: List,
  name: 'list',
  path: '/',
}, {
  component: GlobalSettings,
  name: 'global-settings',
  path: '/settings',
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
    component: ProjectSettings,
    name: 'project-settings',
    path: 'settings',
  }],
}];

export default new VueRouter({
  mode: 'history',
  routes,
});
