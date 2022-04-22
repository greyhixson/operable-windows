module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
    'plugin:vuejs-accessibility/recommended',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'max-len': ['error', { code: 120 }],
  },
};
