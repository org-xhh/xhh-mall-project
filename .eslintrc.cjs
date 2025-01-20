/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier/skip-formatting'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    __PROJECT_VERSION__: true
  },
  rules: {
    // 关闭组件命名规则
    'vue/multi-word-component-names': 'off',
    'no-trailing-spaces': 2
  }
}
