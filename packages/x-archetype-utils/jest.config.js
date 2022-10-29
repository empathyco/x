module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
