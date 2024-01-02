import { XBus } from '@empathyco/x-bus';
import { WireMetadata, XEventsTypes } from '../../wiring/index';
import { NormalisedSnippetConfig, SnippetConfig, XAPI } from './api.types';

/**
 * Default implementation for {@link XAPI}.
 *
 * @public
 */
export class BaseXAPI implements XAPI {
  /**
   * Flag to check if the initialization was already done.
   *
   * @internal
   */
  protected isXInitialized = false;

  /**
   * Bus for emitting and listening events.
   *
   * @internal
   */
  protected bus!: XBus<XEventsTypes, WireMetadata>;

  /**
   * The callback to call from the init method. The logic of initialization is out of this API
   * since this API is just a facade.
   *
   * @internal
   */
  protected initCallback!: (config: SnippetConfig) => any;

  /**
   * Getter for the snippet config object.
   *
   * @returns The {@link NormalisedSnippetConfig | snippetConfig} object.
   *
   * @public
   */
  public getSnippetConfig!: () => SnippetConfig;

  /**
   * Callback that allows to update the snippet config. The logic of initialization is out of this
   * API since this API is just a facade.
   *
   * @internal
   */
  protected snippetCallback!: (config: Partial<SnippetConfig>) => void;

  /**
   * Tracks that a product was added to cart from PDP.
   *
   * @param productId - The product id that was added to cart.
   */
  addProductToCart(productId?: string): void {
    this.bus?.emit('UserClickedPDPAddToCart', productId);
  }

  /**
   * Setter for the {@link @empathyco/x-bus#XBus}.
   *
   * @param bus - The {@link @empathyco/x-bus#XBus} received to emit events.
   *
   * @internal
   */
  setBus(bus: XBus<XEventsTypes, WireMetadata>): void {
    this.bus = bus;
  }

  /**
   * Setter for the callback to call in the init method.
   *
   * @param initCallback - The callback to call.
   */
  setInitCallback(initCallback: (config: SnippetConfig) => any): void {
    this.initCallback = initCallback;
  }

  /**
   * Setter for the callback to modify the snippet config.
   *
   * @param snippetCallback - The callback to call.
   *
   * @internal
   */
  setSnippetConfigCallback(snippetCallback: (config: Partial<SnippetConfig>) => void): void {
    this.snippetCallback = snippetCallback;
  }

  /**
   * Sets or updates the snippet config getter.
   *
   * @param snippetConfigGetter - A function that returns the snippet config.
   *
   * @internal
   */
  setSnippetConfigGetter(snippetConfigGetter: () => NormalisedSnippetConfig): void {
    this.getSnippetConfig = snippetConfigGetter;
  }

  /**
   * Sets or updates the snippet config.
   *
   * @param config - A part or all the snippet config.
   *
   * @public
   */
  setSnippetConfig(config: Partial<SnippetConfig>): void {
    this?.snippetCallback(config);
  }

  /**
   * Searches the query parameter as user query.
   *
   * @param query - Query to be searched.
   *
   * @public
   */
  search(query?: string): void {
    if (query) {
      this.bus?.emit('UserAcceptedAQuery', query);
    }
    this.bus?.emit('UserClickedOpenX');
  }

  /**
   * Initializes the Application passing the {@link SnippetConfig}.
   *
   * @param config - The config coming from the customer snippet.
   *
   * @returns A promise that will be resolved once x components are initialized.
   *
   * @public
   */
  async init(config: SnippetConfig): Promise<void> {
    if (!this.isXInitialized) {
      this.isXInitialized = true;
      await this?.initCallback(config);
    } else {
      //eslint-disable-next-line no-console
      console.warn('We know X is awesome, but you only need to initialize it once.');
    }
  }

  /**
   * Closes the Application.
   *
   * @public
   */
  close(): void {
    this.bus?.emit('UserClickedCloseX');
  }
}
