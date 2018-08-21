import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only'
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import vue from 'rollup-plugin-vue';

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

export default {
  input: 'app/index.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    sourcemap: false,
  },
  plugins,
};
