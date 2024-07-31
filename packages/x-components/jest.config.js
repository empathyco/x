module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.scss$': 'jest-scss-transform'
  },
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  // jest 27 changes the default environment to node instead of jsdom
  // https://jestjs.io/blog/2021/05/25/jest-27#flipping-defaults
  testEnvironment: 'jsdom',
  globals: {
    'vue-jest': {
      templateCompiler: {
        compilerOptions: {
          // Set whitespace to 'condense' to have a more similar behavior to browsers
          // https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#options
          whitespace: 'condense'
        }
      }
    }
  }
};
