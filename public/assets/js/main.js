import { config } from './config.js';
import { run } from './run.js';
import { FiddleResult } from './fiddle-result.js';
import { ViewController } from './view-controller.js';

const app = angular.module('app', []);

app.config(config);
app.run(run);
app.controller('ViewController', ViewController);

angular.bootstrap(document, ['app', 'ui.codemirror'], {
  strictDi: true
});

customElements.define('fiddle-result', FiddleResult);
