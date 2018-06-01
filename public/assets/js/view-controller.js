import { Fiddle } from './fiddle.js';
import { getItem } from './store.js';

ViewController.$inject = ['$scope'];

export function ViewController($scope) {
  const vm = this;

  vm.view = 'start';
  vm.views = ['start', 'fiddle', 'menu'];

  vm.pane = false;
  vm.panes = ['html', 'css', 'javascript'];

  vm.fiddle = false;
  vm.fiddles = [];

  getItem('fiddles', []).map(key => {
    const fiddle = Fiddle.load(key);
    vm.fiddles.push(fiddle);
  });

  $scope.$watch('vm.fiddle', () => {
    if (vm.fiddle) vm.fiddle.save();
  }, true);

  vm.add = (data) => {
    const fiddle = Fiddle.create(data);
    vm.fiddles.push(fiddle);
  };

  vm.copy = () => {
    vm.fiddle.copy();
  };

  vm.delete = () => {
    if (!confirm('Are you sure?')) return;
    const key = vm.fiddle.key;
    vm.fiddle.delete();
    vm.fiddles = vm.fiddles.filter(fiddle => fiddle.key !== key);
    vm.fiddle = false;
    vm.view = 'start';
  };

  vm.import = () => {
    try {
      const data = JSON.parse(vm.importJSON);
      vm.add(data);
      delete vm.importJSON;
    } catch (error) {
      alert(error);
    }
  };

  vm.menuToggle = () => {
    vm.view = (vm.view === 'fiddle') ? 'menu' : 'fiddle';
  };

  vm.showFiddle = (fiddle) => {
    vm.view = 'fiddle';
    vm.fiddle = fiddle;
    vm.showPane('html');
  };

  vm.showPane = (pane) => {
    vm.pane = pane;
    if (vm.panes.includes(vm.pane)) {
      vm.codemirrorOpts = {
        inputStyle: 'textarea',
        theme: 'monokai',
        mode: pane === 'html' ? 'htmlmixed' : pane
      };
    }
  };
}
