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
  rules: {
    'no-param-reassign': ["error", { "props": false }],
    'space-before-function-paren': ['error', 'never'],
  },
};
