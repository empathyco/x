// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('@cypress/webpack-preprocessor');

module.exports = on => {
  on(
    'file:preprocessor',
    webpack({
      webpackOptions: require('@vue/cli-service/webpack.config'),
      watchOptions: {}
    })
  );
};
