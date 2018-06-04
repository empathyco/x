const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/deep-merge.ts',

  output: {
    path: path.resolve('dist'),
    filename: 'deep-merge.js'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['babel-loader', 'ts-loader']
      }
    ]
  }
};
