module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(m|c)?(t|j)sx?$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.scss$': 'jest-scss-transform',
  },
  moduleNameMapper: {
    'vue-global-events': '<rootDir>/node_modules/vue-global-events/dist/index.cjs',
  },
  moduleFileExtensions: ['ts', 'vue', 'js', 'mjs'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
    html: '<html lang="en-US"></html>',
    url: 'https://empathy.co/',
    userAgent: 'Agent/007',
  },
  globals: {
    'vue-jest': {
      templateCompiler: {
        compilerOptions: {
          // Set whitespace to 'condense' to have a more similar behavior to browsers
          // https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#options
          whitespace: 'condense',
        },
      },
    },
  },
}
