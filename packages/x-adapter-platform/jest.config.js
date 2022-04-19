module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch: ['<rootDir>/**/*.spec.ts']
};
