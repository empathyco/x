/**
 * The style payload interface.
 * @public
 */
/**
 * The XCSSInjector interface.
 * Custom CSS injector that allows to inject styles into a host element.
 * @public
 */
export interface XCSSInjector {
  /** Set of hosts that will receive the styles. */
  hosts: Set<Document | ShadowRoot>
  /** Styles that will be injected into the hosts. */
  stylesToAdopt: CSSStyleSheet[]
  /** Function that will add the styles to the host. */
  push: (css: string) => void
  /** Adds the element to the hosts set. */
  addHost: (el: Document | ShadowRoot) => void
  /** Removes the element from the hosts set. */
  removeHost: (el: Document | ShadowRoot) => void
}

/**
 * The XCSSInjector is added to window.
 * @public
 * @deprecated - It should not be required. It will be removed in the future.
 */
export type WindowWithInjector = Window & { xCSSInjector?: XCSSInjector }
