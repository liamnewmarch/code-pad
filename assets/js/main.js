(function() {
  'use strict';


  if ('serviceWorker' in navigator)
    navigator.serviceWorker.register('service-worker.js');


  const app = angular.module('app', [ 'ui.codemirror' ]);


  app.directive('iframe', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var fiddle = false;

        element.on('load', function(event) {
          if (!fiddle)
            return;

          const iframe = element[0].contentWindow;

          iframe.document.body.innerHTML = fiddle.html;

          const style = iframe.document.createElement('style');
          style.innerHTML = fiddle.css || '';
          iframe.document.head.appendChild(style);

          try {
            iframe.eval(fiddle.javascript || '');
          } catch (error) {
            alert(error);
          }
        });

        scope.$on('refresh', function(event, data) {
          fiddle = data;
          element[0].contentWindow.location.reload();
        });
      }
    };
  });


  app.factory('Fiddle', function() {
    const defaults = {
      name: 'Untitled',
      html: '<p> Hello, world! </p>\n',
      css: 'html {\n  background-color: #272822;\n  color: #fff;\n}\n',
      javascript: 'const p = document.querySelector(\'p\');\n'
    };

    return function(data) {
      return angular.extend({
        key: Math.floor(new Date() / 1000).toString(36)
      }, defaults, data);
    };
  });


  app.controller('ViewController', [ '$scope', 'Fiddle', function($scope, Fiddle) {
    const vm = this;

    vm.view = 'start';
    vm.views = ['start', 'fiddle', 'menu'];

    vm.pane = false;
    vm.panes = ['html', 'css', 'javascript'];

    vm.fiddle = false;
    vm.fiddles = [];

    if ('fiddles' in localStorage) {
      JSON.parse(localStorage.fiddles).map(function(key) {
        if (key in localStorage) {
          const data = JSON.parse(localStorage[key]);
          const fiddle = new Fiddle(data);
          vm.fiddles.push(fiddle);
        }
      });
    }

    $scope.$watch('vm.fiddle', function() {
      if (vm.fiddle)
        localStorage[vm.fiddle.key] = JSON.stringify(vm.fiddle);
    }, true);

    vm.add = function() {
      const fiddle = new Fiddle();
      vm.fiddles.push(fiddle);
      localStorage[fiddle.key] = JSON.stringify(fiddle);
      const ids = vm.fiddles.map(fiddle => fiddle.key);
      localStorage.fiddles = JSON.stringify(ids);
      vm.showFiddle(fiddle);
    };

    vm.copy = function() {
      const textarea = document.createElement('textarea');
      textarea.value = JSON.stringify(vm.fiddle);
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    };

    vm.delete = function() {
      if (!confirm('Are you sure?'))
        return;

      const key = vm.fiddle.key;
      if (key in localStorage)
        delete localStorage[key];
      vm.fiddles = vm.fiddles.filter(fiddle => fiddle.key !== key);
      const ids = vm.fiddles.map(fiddle => fiddle.key);
      localStorage.fiddles = JSON.stringify(ids);
      vm.fiddle = false;
      vm.view = 'start';
    }

    vm.menuToggle = function() {
      vm.view = (vm.view === 'fiddle') ? 'menu' : 'fiddle';
    }

    vm.showFiddle = function(fiddle) {
      vm.view = 'fiddle';
      vm.fiddle = fiddle;
      vm.showPane('html');
    };

    vm.showPane = function(pane) {
      vm.pane = pane;
      if (vm.pane === 'result') {
        $scope.$broadcast('refresh', vm.fiddle);
      } else {
        vm.codemirrorOpts = {
          theme: 'monokai',
          mode: pane === 'html' ? 'htmlmixed' : pane
        };
      }
    };

  }]);

})();
