(function() {
    'use strict';

    var app = angular.module('app', [
        'ngSanitize'
    ]);

    app.controller('ResultController', [ '$sce', function($sce) {
        var vm = this;
        vm.html = $sce.trustAs('html', localStorage.html) || '';
        vm.css = $sce.trustAs('css', localStorage.css) || '';
        vm.js = $sce.trustAs('js', localStorage.js) || '';

        console.time();
        eval(vm.js);
        console.timeEnd();
    }]);

})();
