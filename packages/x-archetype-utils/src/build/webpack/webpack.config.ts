/**.
 * Self-made interface since Webpack does not provide a type for this object.
 * Https://github.com/webpack/webpack/blob/main/declarations/WebpackOptions.d.ts#L463
 *
 * @internal
 */
interface webpackFilenameTemplateInfo {
  identifier: string;
  shortIdentifier: string;
  resource: string;
  resourcePath: string;
  absoluteResourcePath: string;
  allLoaders: string;
  query: string;
  moduleId: string;
  hash: string;
  namespace: string;
}

export const webpackConfig = {
  transpileDependencies: ['@empathyco/x-components'],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.ts|js|vue$/,
          enforce: 'pre',
          use: ['source-map-loader']
        }
      ]
    },
    output: {
      devtoolModuleFilenameTemplate: ({ resourcePath, hash, query }: webpackFilenameTemplateInfo) =>
        resourcePath.match(/\.vue$/) &&
        !query.match(/type=script/) &&
        !query.match(/\?rollup-plugin-vue=script.ts/)
          ? `webpack-generated:///${resourcePath}?${hash}`
          : `sources://${resourcePath}`,
      devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]'
    }
  }
};
