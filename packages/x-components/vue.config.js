module.exports = {
  configureWebpack: {
    entry: ['./src/main.ts'],
    output: {
      devtoolModuleFilenameTemplate: ({ resourcePath, hash, query }) =>
        resourcePath.match(/\.vue$/) &&
        !query.match(/type=script/) &&
        !query.match(/\?rollup-plugin-vue=script.ts/)
          ? `webpack-generated:///${resourcePath}?${hash}`
          : `sources://${resourcePath}`,
      devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]'
    }
  }
};
