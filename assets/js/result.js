(function() {
  'use strict';

  var fiddle = JSON.parse(localStorage.fiddle || '{}');

  // HTML
  var main = document.querySelector('body');
  main.innerHTML = fiddle.html || '';

    // CSS
  var style = document.createElement('style');
  style.innerHTML = fiddle.css || '';
  document.head.appendChild(style);

  // JS
  eval(fiddle.javascript || '');

})();
