const base = require('../../jest-base.config');

module.exports = {
  ...base,
  moduleFileExtensions: ['ts', 'js'],
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/*.spec.ts']
};
