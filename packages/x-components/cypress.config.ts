import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
// @ts-expect-error TS definitions are wrong
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    defaultCommandTimeout: 7000,
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
        createBundler({
          plugins: [createEsbuildPlugin(config)]
        })
      );
      return config;
    },
    specPattern: 'tests/e2e/**/*.feature'
  },
  component: {
    specPattern: 'tests/unit/**/*.spec.ts',
    supportFile: 'tests/support/index.ts',
    indexHtmlFile: 'tests/support/component-index.html',
    screenshotOnRunFailure: false,
    video: false,
    devServer: {
      bundler: 'webpack',
      framework: 'vue-cli'
    }
  }
});
