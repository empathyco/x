export interface XCSSInjector {
  /** Function that will add the styles to the host. */
  addStyle: (styles: { source: string }) => void
  /** Function setting the host for the injector. */
  setHost: (el: Element | ShadowRoot) => void
  /** Set injector instance in the window object. */
  setInWindow: () => void
  /** Check if the instance is set in the window object. */
  isInWindow: () => boolean
}

export interface MultiHostXCSSInjector extends XCSSInjector {
  /** Function setting the host for the injector. */
  addHost: (el: Element | ShadowRoot) => void
  /** Removes the element from the hosts set. */
  removeHost: (el: Element | ShadowRoot) => void
}

export type WindowWithInjector = Window & { xCSSInjector?: XCSSInjector | MultiHostXCSSInjector }

/** The style payload interface that will be used to inject styles into the host element. */
export interface Style {
  source: string
}
