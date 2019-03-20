import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import vue from 'rollup-plugin-vue';

import { version } from './package.json';

const plugins = [
  commonjs(),
  css(),
  vue({
    css: false,
  }),
  babel({
    exclude: 'node_modules/**',
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VUE_ENV': '"browser"',
  }),
  resolve({
    extensions: ['.js', '.vue'],
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(uglify());
}

const app = {
  input: 'src/app.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    sourcemap: false,
  },
  plugins,
};

const serviceWorker = {
  input: 'src/service-worker.js',
  output: {
    file: 'public/service-worker.js',
    format: 'iife',
    sourcemap: false,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      VERSION: version,
    }),
    uglify(),
  ],
};

export default [app, serviceWorker];
