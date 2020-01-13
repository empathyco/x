module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  setupFilesAfterEnv: ['./jest.setup.ts']
};
