const base = require('../../jest-base.config');

module.exports = {
  ...base,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.spec.ts']
};
