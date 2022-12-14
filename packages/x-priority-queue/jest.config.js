const base = require('../../jest-base.config');

module.exports = {
  ...base,
  moduleFileExtensions: ['ts', 'js'],
  preset: 'ts-jest',
  rootDir: 'src',
  testMatch: ['<rootDir>/**/*.spec.ts']
};
