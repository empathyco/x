import type { WindowWithInjector, XCSSInjector } from './css-injector.types'

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
   * @param css - The styles to be added.
   */
  addStyle(css: string[]): void {
    if (!Array.isArray(css)) {
      return
    }
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(css.join('\n'))
    this.stylesToAdopt.push(sheet)
    this.hosts.forEach(host => host.adoptedStyleSheets.push(sheet))
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
  ;(window as WindowWithInjector).xCSSInjector ??= cssInjector
}
