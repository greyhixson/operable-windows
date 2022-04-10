module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],

  parserOptions: {
    parser: 'babel-eslint',
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'max-len': ["error", { "code": 120 }]
  },
};
