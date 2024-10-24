export const rollupCssInjectorConfig = {
  replace: {
    // Replace X CSS injector by our custom one.
    'export default injectCss;':
      'export default (css) => window.xCSSInjector.addStyle({ source: css });',
    delimiters: ['', '']
  },
  styles: {
    mode: ['inject', (varname: string) => `window.xCSSInjector.addStyle({ source: ${varname} });`]
  }
};
