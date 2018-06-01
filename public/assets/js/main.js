import { config } from './config.js';
import { run } from './run.js';
import { iframe } from './iframe.js';
import { Fiddle } from './fiddle.js';
import { ViewController } from './view-controller.js';

const app = angular.module('app', []);

app.config(config);
app.run(run);
app.directive('iframe', iframe);
app.factory('Fiddle', Fiddle);
app.controller('ViewController', ViewController);

angular.bootstrap(document, ['app', 'ui.codemirror'], {
  strictDi: true
});
