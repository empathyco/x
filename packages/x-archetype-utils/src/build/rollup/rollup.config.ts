export const rollupCssInjectorConfig = {
  replace: {
    // Replace X CSS injector by our custom one.
    'injectCss(css);': 'window.xCSSInjector.addStyle(css);',
    delimiters: ['', '']
  },
  styles: {
    mode: ['inject', (varname: string) => `window.xCSSInjector.addStyle({ source: ${varname} });`]
  }
};
