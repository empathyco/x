const base = require('../../jest-base.config');

module.exports = {
  ...base,
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch: ['<rootDir>/**/*.spec.ts']
};
