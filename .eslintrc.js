module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['dist/'],
  rules: {
    // Define or override rules here
    'no-console': 'off', // Example: Allow console statements
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
  },
  parser: '@babel/eslint-parser',
  plugins: ['react'],
};
