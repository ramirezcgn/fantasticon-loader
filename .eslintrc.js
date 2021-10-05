module.exports = {
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'script',
    modules: true,
    ecmaVersion: 2018,
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
