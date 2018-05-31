config.$inject = ['$compileProvider'];

export function config($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}
