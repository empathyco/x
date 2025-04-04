import type { WindowWithInjector, XCSSInjector } from './css-injector.types';

/**
 * Instance of the injector that will be used across all the initializations.
 */
let instance: CssInjector | null = null;

/**
 * Custom CSS injector that allows to inject styles into a host element.
 *
 * @public
 */
export class CssInjector implements XCSSInjector {
  protected host!: Element | ShadowRoot;
  protected stylesQueue: string[] = [];

  /**
   * Initializes the instance of the injector if it's not already initialized and sets it in the
   * window object if it's required.
   *
   * @param setInWindow - Whether to set the injector instance in the window object.
   */
  public constructor(setInWindow = true) {
    if (!(instance instanceof CssInjector)) {
      // eslint-disable-next-line ts/no-this-alias
      instance = this;
    }

    if (setInWindow) {
      this.setInWindow();
    }

    return instance;
  }

  /**
   * Adds the styles to the host element.
   *
   * @param styles - The styles to be added.
   * @param styles.source - Styles source.
   */
  addStyle(styles: { source: string }): void {
    this.stylesQueue.push(styles.source);
    if (this.host) {
      this.stylesQueue.forEach(styles => {
        const styleTag = document.createElement('style');
        styleTag.textContent = styles;
        this.host.appendChild(styleTag);
      });
      this.stylesQueue = [];
    }
  }

  /**
   * Sets the host element.
   *
   * @param host - The host element.
   */
  setHost(host: Element | ShadowRoot): void {
    this.host = host;
  }

  /**
   * Sets the injector instance in the window object.
   */
  setInWindow(): void {
    if (typeof window !== 'undefined' && instance) {
      (window as WindowWithInjector).xCSSInjector = instance;
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
      : (window as WindowWithInjector).xCSSInjector === instance;
  }
}

/**
 * Instance of the injector.
 *
 * @public
 */
export const cssInjector = new CssInjector(typeof window !== 'undefined');
