import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    defaultCommandTimeout: 7000,
    requestTimeout: 7000,
    viewportHeight: 1080,
    viewportWidth: 1920,
    screenshotOnRunFailure: false,
    video: false,
    supportFile: 'tests/support/index.ts',
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    retries: {
      openMode: 0,
      runMode: 1
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        require('@bahmutov/cypress-esbuild-preprocessor')({
          plugins: [createEsbuildPlugin(config)]
        })
      );
      return config;
    },
    specPattern: 'tests/e2e/**/*.feature',
    experimentalRunAllSpecs: true
  },
  component: {
    defaultCommandTimeout: 7000,
    experimentalSingleTabRunMode: true,
    specPattern: 'tests/unit/**/*.spec.ts',
    supportFile: 'tests/support/index.ts',
    indexHtmlFile: 'tests/support/component-index.html',
    screenshotOnRunFailure: false,
    video: false,
    retries: {
      openMode: 0,
      runMode: 1
    },
    devServer: {
      bundler: 'webpack',
      framework: 'vue-cli'
    }
  }
});
