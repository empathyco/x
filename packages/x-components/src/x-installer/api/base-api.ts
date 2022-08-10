import { XBus } from '../../plugins/x-bus.types';
import { SnippetConfig, XAPI } from './api.types';

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
  protected bus!: XBus;

  /**
   * The callback to call from the init method. The logic of initialization is out of this API
   * since this API is just a facade.
   *
   * @internal
   */
  protected initCallback!: (config: SnippetConfig) => any;

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
   * Setter for the {@link XBus}.
   *
   * @param bus - The {@link XBus} received to emit events.
   *
   * @internal
   */
  setBus(bus: XBus): void {
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
   * @public
   */
  init(config: SnippetConfig): void {
    if (!this.isXInitialized) {
      this.isXInitialized = true;
      this?.initCallback(config);
    } else {
      //eslint-disable-next-line no-console
      console.warn('We know X is awesome, but you only need to initialize it once.');
    }
  }
}
