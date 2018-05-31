export function iframe() {
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
}
