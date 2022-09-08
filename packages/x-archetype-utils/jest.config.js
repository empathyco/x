module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jsdom'
};
