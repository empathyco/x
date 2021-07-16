const { startDevServer } = require('@cypress/webpack-dev-server');
const webpackConfig = require('@vue/cli-service/webpack.config.js');
const cucumber = require('cypress-cucumber-preprocessor').default;
const path = require('path');

module.exports = (on, config) => {
  on('dev-server:start', options =>
    startDevServer({
      options,
      webpackConfig
    })
  );

  on(
    'file:preprocessor',
    cucumber({ typescript: path.dirname(require.resolve('typescript/package.json')) })
  );

  return config;
};
