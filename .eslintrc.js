module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'class-methods-use-this': 0,
    '@typescript-eslint/no-inferrable-types': 1,
    'lines-between-class-members': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'no-param-reassign': 0,
    '@typescript-eslint/no-var-requires': 0,
    "max-len": [2, 124, 4, {"ignoreUrls": true}],
    "prefer-const": ["off", {
      "destructuring": "any",
      "ignoreReadBeforeAssign": false
    }]
  },
};
