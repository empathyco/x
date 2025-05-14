export const rollupCssInjectorConfig = {
  styles: {
    mode: ['inject', (varname: string) => `window.xCSSInjector.addStyle({ source: ${varname} });`],
  },
}
