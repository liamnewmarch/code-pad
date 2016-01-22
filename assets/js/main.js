(function() {
    'use strict';

    var app = angular.module('app', [
        'ui.codemirror'
    ]);


    app.directive('iframe', function() {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                element = element[0];
                scope.$on('refresh', function() {
                    element.contentWindow.location.reload();
                });
            }
        };
    });

    app.controller('EditorController', [ '$scope', function($scope) {
        var vm = this;

        vm.panes = [];
        vm.active = 'html';

        addPane('html', 'HTML');
        addPane('css', 'CSS');
        addPane('javascript', 'JS');
        addPane('result', 'Result');

        function addPane(key, label) {
            vm.panes.push({
                key: key,
                label: label,
                model: key in localStorage ? localStorage[key] : '',
                config: {
                    theme: 'monokai',
                    mode: key === 'html' ? 'htmlmixed' : key
                }
            });
        }

        $scope.$watch('vm.active', function() {
            if (vm.active === 'result') {
                $scope.$broadcast('refresh');
            }
        });

        $scope.$watch('vm.panes', function() {
            vm.panes.forEach(function(pane) {
                localStorage[pane.key] = pane.model;
            });
        }, true);
    }]);

})();
