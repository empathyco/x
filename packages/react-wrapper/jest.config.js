const base = require('../../jest-base.config');

module.exports = {
  ...base,
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.spec.ts?(x)'],
  // jest 27 changes the default environment to node instead of jsdom
  // https://jestjs.io/blog/2021/05/25/jest-27#flipping-defaults
  testEnvironment: 'jsdom'
};
