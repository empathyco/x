const base = require('../../jest-base.config');

module.exports = {
  ...base,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts']
};
