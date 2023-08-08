export const rollupCssInjectorConfig = {
  replace: {
    // Replace X CSS injector by our custom one.
    'addStyle(id, style);': 'window.xCSSInjector.addStyle(style);',
    delimiters: ['', '']
  },
  styles: {
    mode: ['inject', (varname: string) => `window.xCSSInjector.addStyle({ source: ${varname} });`]
  }
};
