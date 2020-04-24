import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import { version } from '../package.json';

const plugins = [
  replace({
    VERSION: version,
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(terser());
}

export default {
  input: 'src/service-worker.js',
  output: {
    file: 'public/service-worker.js',
    format: 'es',
    sourcemap: false,
  },
  plugins,
};
