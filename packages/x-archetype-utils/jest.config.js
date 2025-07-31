module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
    html: '<html lang="en-US"></html>',
    url: 'https://empathy.co/',
    userAgent: 'Agent/007',
  },
}
