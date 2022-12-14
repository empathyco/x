const base = require('../../jest-base.config');

module.exports = {
  ...base,
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testEnvironment: 'jsdom'
};
