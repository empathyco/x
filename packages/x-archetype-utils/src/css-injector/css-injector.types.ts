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

export type WindowWithInjector = Window & { xCSSInjector?: XCSSInjector }
