import type { Style, WindowWithInjector, XCSSInjector } from './css-injector.types'

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
  protected hosts = new Set<Element | ShadowRoot>()
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
    this.stylesQueue.push(style)
    const styleTag = document.createElement('style')
    styleTag.textContent = style.source
    this.hosts.forEach(host => host.appendChild(styleTag.cloneNode()))
  }

  /**
   * Sets the host element. Alias of addHost method.
   *
   * @param host - The host element.
   */
  setHost(host: Element | ShadowRoot): void {
    this.addHost(host)
  }

  /**
   * Adds the element to the hosts set.
   *
   * @param host - The host element.
   */
  addHost(host: Element | ShadowRoot): void {
    this.hosts.add(host)
    // Add all pending styles to the host element
    this.stylesQueue.forEach(style => {
      const styleTag = document.createElement('style')
      styleTag.textContent = style.source
      host.appendChild(styleTag.cloneNode())
    })
  }

  /**
   * Removes the element from the hosts set.
   *
   * @param host - The host element to remove.
   */
  removeHost(host: Element | ShadowRoot): void {
    this.hosts.delete(host)
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
