module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./src/__tests__/tests.config.ts'],
  testMatch: ['<rootDir>/**/*.spec.ts']
};
