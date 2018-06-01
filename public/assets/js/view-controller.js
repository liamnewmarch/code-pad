ViewController.$inject = ['$scope', 'Fiddle'];

export function ViewController($scope, Fiddle) {
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

  vm.add = function(data) {
    const fiddle = new Fiddle(data);
    vm.fiddles.push(fiddle);
    localStorage[fiddle.key] = JSON.stringify(fiddle);
    const ids = vm.fiddles.map(fiddle => fiddle.key);
    localStorage.fiddles = JSON.stringify(ids);
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

  vm.import = function() {
    try {
      const data = JSON.parse(vm.importJSON);
      delete data.key;
      vm.add(data);
      delete vm.importJSON;
    } catch (error) {
      alert(error);
    }
  };

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
        inputStyle: 'textarea',
        theme: 'monokai',
        mode: pane === 'html' ? 'htmlmixed' : pane
      };
    }
  };
}
