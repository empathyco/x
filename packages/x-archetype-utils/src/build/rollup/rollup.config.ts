export const rollupCssInjectorConfig = {
  styles: {
    mode: ['inject', (varname: string) => `(window.xCSSInjector ??= []).push(${varname});`],
  },
}
