const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/deep-merge.ts',

  output: {
    path: path.resolve('dist'),
    filename: 'deep-merge.js',
    library: 'eb-deep-merge',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader']
      }
    ]
  }
};
