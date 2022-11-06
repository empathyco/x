module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'lint',
  testMatch: [
    '<rootDir>/packages/**/src/**/*.ts',
    '<rootDir>/packages/**/src/**/*.tsx',
    '<rootDir>/packages/**/src/**/*.vue'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'vue']
};
