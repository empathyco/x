const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const {resolve} = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  }
};
