(function() {
    'use strict';

    // HTML
    var main = document.querySelector('main');
    main.innerHTML = localStorage.html || '';

    // CSS
    var style = document.createElement('style');
    style.innerHTML = localStorage.css || '';
    document.head.appendChild(style);

    // JS
    eval(localStorage.javascript || '');

})();
