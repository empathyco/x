const { startDevServer } = require('@cypress/webpack-dev-server');
const webpackConfig = require('@vue/cli-service/webpack.config.js');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');

module.exports = async (on, config) => {
  on('dev-server:start', options =>
    startDevServer({
      options,
      webpackConfig
    })
  );

  await addCucumberPreprocessorPlugin(on, config);

  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin(config)]
    })
  );
  return config;
};
