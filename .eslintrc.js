module.exports = {
  env: {
    es6: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      impliedStrict: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-param-reassign': ["error", { "props": false }],
    'no-shadow': ['error', { 'allow': ['state'] }],
    'space-before-function-paren': ['error', 'never'],
  },
};
