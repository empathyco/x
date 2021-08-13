module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/__tests__/tests.setup.ts'],
  testMatch: ['<rootDir>/**/*.spec.ts'],
  modulePaths: ["node_modules"] //TODO: Delete this when the facets refactor is done [EX-3505]
};
