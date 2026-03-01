/**
 * This plugin add a custom block to Vue SFC files that injects the css styles using the global xCSSInjector.
 */
export function viteCssInjectorPlugin() {
  return {
    name: 'css-injector-plugin',
    //enforce: 'pre',
    transform(code: string, id: string) {
      if (!id.endsWith('.vue') || !code.includes('</style>')) return
      return `${code}
        <x-inject-css type="text/javascript" lang="js">
          export default component => Promise.resolve(component).then(comp => (window.xCSSInjector ??= []).push(...comp.styles));
        </x-inject-css>
      `
    },
  }
}
