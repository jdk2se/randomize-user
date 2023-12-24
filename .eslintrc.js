module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    "parser": "@typescript-eslint/parser"
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'vue/no-unused-vars': 'error'
  },
};
