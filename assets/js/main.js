(function() {
  'use strict';


  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }


  const app = angular.module('app', [
    'ui.codemirror'
  ]);


  app.directive('iframe', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        element = element[0];
        scope.$on('refresh', function(event, fiddle) {
          localStorage.fiddle = JSON.stringify(fiddle);
          element.contentWindow.location.reload();
        });
      }
    };
  });


  app.factory('Fiddle', function() {
    var defaults = {
      name: 'Untitled',
      html: '',
      css: '',
      javascript: ''
    };
    return function(data) {
      return angular.extend({
        key: Math.floor(new Date() / 1000).toString(36)
      }, defaults, data);
    };
  });


  app.controller('ViewController', [ '$scope', 'Fiddle', function($scope, Fiddle) {
    var vm = this;

    vm.view = 'start';
    vm.views = ['start', 'fiddle', 'menu'];

    vm.pane = false;
    vm.panes = ['html', 'css', 'javascript'];

    vm.fiddle = false;
    vm.fiddles = [];

    if ('fiddles' in localStorage) {
      JSON.parse(localStorage.fiddles).map(function(key) {
        if (key in localStorage) {
          var data = JSON.parse(localStorage[key]);
          var fiddle = new Fiddle(data);
          vm.fiddles.push(fiddle);
        }
      });
    }

    $scope.$watch('vm.fiddle', function() {
      if (vm.fiddle) {
        localStorage[vm.fiddle.key] = JSON.stringify(vm.fiddle);
      }
    }, true);

    vm.add = function() {
      var fiddle = new Fiddle();
      vm.fiddles.push(fiddle);
      localStorage[fiddle.key] = JSON.stringify(fiddle);
      localStorage.fiddles = JSON.stringify(vm.fiddles.map(function(fiddle) {
        return fiddle.key;
      }));
      vm.showFiddle(fiddle);
    };

    vm.delete = function() {
      if (confirm('Are you sure?')) {
        var key = vm.fiddle.key;
        if (key in localStorage) {
          delete localStorage[key];
        }
        vm.fiddles = vm.fiddles.filter(function(fiddle) {
          return fiddle.key !== key;
        });
        localStorage.fiddles = JSON.stringify(vm.fiddles.map(function(fiddle) {
          return fiddle.key;
        }));
        vm.fiddle = false;
        vm.view = 'start';
      }
    }

    vm.menuToggle = function() {
      if (vm.view === 'fiddle') {
        vm.view = 'menu';
      } else {
        vm.view = 'fiddle';
      }
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
