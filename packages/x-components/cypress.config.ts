import { defineConfig } from 'cypress'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild'

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
    downloadsFolder: 'tests/e2e/downloads',
    experimentalRunAllSpecs: true,
    screenshotOnRunFailure: false,
    video: false,
    retries: {
      openMode: 0,
      runMode: 1,
    },
    // https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/quick-start.md
    async setupNodeEvents(on, config) {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more.
      await addCucumberPreprocessorPlugin(on, config)

      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }))

      // Make sure to return the config object as it might have been modified by the plugin.
      return config
    },
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
      runMode: 1,
    },
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})
