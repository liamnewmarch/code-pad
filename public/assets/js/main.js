import { config } from './config.js';
import { iframe } from './iframe.js';
import { Fiddle } from './fiddle.js';
import { ViewController } from './view-controller.js';

if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('service-worker.js');

const app = angular.module('app', []);

app.config(config);
app.directive('iframe', iframe);
app.factory('Fiddle', Fiddle);
app.controller('ViewController', ViewController);

angular.bootstrap(document, ['app', 'ui.codemirror'], {
  strictDi: true
});
