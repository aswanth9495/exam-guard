module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: ['dist/'],
  rules: {
    // Define or override rules here
    'no-console': 'off', // Example: Allow console statements
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
  },
};
