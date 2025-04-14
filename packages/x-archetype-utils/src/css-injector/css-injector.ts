import type { WindowWithInjector, XCSSInjector } from './css-injector.types'
/**
 * The style interface that will be used to inject styles into the host element.
 */
interface Style {
  source: string
}

/**
 * Instance of the injector that will be used across all the initializations.
 */
let instance: CssInjector | null = null

/**
 * Custom CSS injector that allows to inject styles into a host element.
 *
 * @public
 */
export class CssInjector implements XCSSInjector {
  protected host: Element | ShadowRoot | undefined
  protected stylesQueue: Style[] = []

  /**
   * Initializes the instance of the injector if it's not already initialized and sets it in the
   * window object if it's required.
   *
   * @param setInWindow - Whether to set the injector instance in the window object.
   */
  public constructor(setInWindow = true) {
    if (!(instance instanceof CssInjector)) {
      // eslint-disable-next-line ts/no-this-alias
      instance = this
    }

    if (setInWindow) {
      this.setInWindow()
    }

    return instance
  }

  /**
   * Adds the style to the host element.
   *
   * @param style - The styles to be added.
   * @param style.source - Styles source.
   */
  addStyle(style: Style): void {
    if (!this.host) {
      this.stylesQueue.push(style)
      return
    }

    const styleTag = document.createElement('style')
    styleTag.textContent = style.source
    this.host.appendChild(styleTag)
  }

  /**
   * Sets the host element.
   *
   * @param host - The host element.
   */
  setHost(host: Element | ShadowRoot): void {
    this.host = host
    // Add all pending styles to the host element
    this.stylesQueue.forEach(style => this.addStyle(style))
    this.stylesQueue = []
  }

  /**
   * Sets the injector instance in the window object.
   */
  setInWindow(): void {
    if (typeof window !== 'undefined' && instance) {
      ;(window as WindowWithInjector).xCSSInjector = instance
    }
  }

  /**
   * Checks if the injector instance is in the window object.
   *
   * @returns Whether the injector instance is in the window object.
   */
  isInWindow(): boolean {
    return typeof window === 'undefined'
      ? false
      : (window as WindowWithInjector).xCSSInjector === instance
  }
}

/**
 * Instance of the injector.
 *
 * @public
 */
export const cssInjector = new CssInjector(typeof window !== 'undefined')
