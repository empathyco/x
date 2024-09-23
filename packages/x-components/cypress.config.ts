import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    defaultCommandTimeout: 7000,
    requestTimeout: 7000,
    viewportHeight: 1080,
    viewportWidth: 1920,
    specPattern: 'tests/e2e/**/*.feature',
    supportFile: 'tests/support/index.ts',
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    experimentalRunAllSpecs: true,
    screenshotOnRunFailure: false,
    video: false,
    retries: {
      openMode: 0,
      runMode: 1
    },
    async setupNodeEvents(on, config) {
      const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
      const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');

      // await here
      await require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin(
        on,
        config
      );

      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));

      // return any mods to Cypress
      return config;
    }
  },
  component: {
    defaultCommandTimeout: 7000,
    viewportHeight: 1080,
    viewportWidth: 1920,
    specPattern: 'tests/unit/**/*.spec.ts',
    supportFile: 'tests/support/index.ts',
    indexHtmlFile: 'tests/support/component-index.html',
    experimentalSingleTabRunMode: true,
    screenshotOnRunFailure: false,
    video: false,
    retries: {
      openMode: 0,
      runMode: 1
    },
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  }
});
