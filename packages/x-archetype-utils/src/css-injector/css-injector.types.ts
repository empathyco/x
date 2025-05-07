/** The style payload interface. */
export interface Style {
  /** Css source. */
  source: string
}

export interface XCSSInjector {
  /** Function that will add the styles to the host. */
  addStyle: (style: Style) => void
  /** @deprecated Use addHost method. */
  setHost: (el: Element | ShadowRoot) => void
  /** Adds the element to the hosts set. */
  addHost: (el: Document | ShadowRoot) => void
  /** Removes the element from the hosts set. */
  removeHost: (el: Document | ShadowRoot) => void
  /** Set injector instance in the window object. */
  setInWindow: () => void
  /** Check if the instance is set in the window object. */
  isInWindow: () => boolean
}

export type WindowWithInjector = Window & { xCSSInjector?: XCSSInjector }
