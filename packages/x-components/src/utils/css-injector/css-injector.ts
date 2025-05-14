import type { Style, WindowWithInjector, XCSSInjector } from './css-injector.types'

/**
 * Custom CSS injector that allows to inject styles into a host element.
 *
 * @public
 */
export const cssInjector: XCSSInjector = {
  hosts: new Set<Document | ShadowRoot>(),
  stylesToAdopt: [] as CSSStyleSheet[],
  /**
   * Adds the style to the host element.
   *
   * @param style - The styles to be added.
   * @param style.source - Styles source.
   */
  addStyle(style: Style): void {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(style.source)
    this.stylesToAdopt.push(sheet)
    this.hosts.forEach(host => (host.adoptedStyleSheets = this.stylesToAdopt))
  },
  /**
   * Adds the element to the hosts set.
   *
   * @param host - The host element.
   */
  addHost(host: Document | ShadowRoot): void {
    this.hosts.add(host)
    host.adoptedStyleSheets = [...host.adoptedStyleSheets, ...this.stylesToAdopt]
  },
  /**
   * Removes the element from the hosts set.
   *
   * @param host - The host element to remove.
   */
  removeHost(host: Document | ShadowRoot): void {
    host.adoptedStyleSheets = host.adoptedStyleSheets.filter(
      sheet => !this.stylesToAdopt.includes(sheet),
    )
    this.hosts.delete(host)
  },
}

if (typeof window !== 'undefined') {
  ;(window as WindowWithInjector).xCSSInjector = cssInjector
}
