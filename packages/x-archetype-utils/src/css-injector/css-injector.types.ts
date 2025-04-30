export interface XCSSInjector {
  /** Function that will add the styles to the host. */
  addStyle: (styles: { source: string }) => void
  /** @deprecated Use `addHost` instead.
    Function setting the host for the injector.*/
  setHost: (el: Element | ShadowRoot) => void
  /** Function setting the host for the injector. */
  addHost: (el: Element | ShadowRoot) => void
  /** Removes the element from the hosts set. */
  removeHost: (el: Element | ShadowRoot) => void
  /** Set injector instance in the window object. */
  setInWindow: () => void
  /** Check if the instance is set in the window object. */
  isInWindow: () => boolean
}

export interface MultiHostXCSSInjector extends XCSSInjector {}

export type WindowWithInjector = Window & { xCSSInjector?: XCSSInjector }

/** The style payload interface that will be used to inject styles into the host element. */
export interface Style {
  source: string
}
