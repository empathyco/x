import { XBus } from '../../plugins/x-bus.types';
import { DocumentDirection } from '../../plugins/x-plugin.types';
import { XEvent, XEventPayload } from '../../wiring/events.types';
import { WireMetadata } from '../../wiring/wiring.types';

/**
 * Interface with the API functions exposes as X
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window | window} property.
 *
 * @public
 */
export interface XAPI {
  /**
   * To track that a product was added to the cart from PDP.
   *
   * @param productId - The id of the product added to cart.
   *
   * @remarks if no productId is provided, then the current page url will be used as id for
   * getting the previously stored result information.
   */
  addProductToCart(productId?: string): void;
  /**
   * To set the {@link XBus | bus} to the API. This bus will be used to emit the necessary
   * events.
   *
   * @internal
   * */
  setBus(bus: XBus): void;

  /**
   * To set the callback to call after the call to method init. This is used from {@link XInstaller}
   * because the logic of initialization is there.
   *
   * @param initCallback - The callback to call passing in the {@link SnippetConfig}.
   *
   * @internal
   */
  setInitCallback(initCallback: (config: SnippetConfig) => void): void;

  /**
   * To set or update any property of the {@link SnippetConfig}.
   *
   * @param config - The properties to be changed.
   *
   * @public
   */
  setSnippetConfig(config: Partial<SnippetConfig>): void;

  /**
   * To set the snippet config callback.
   *
   * @param callback - Hello.
   *
   * @internal
   */
  setSnippetConfigCallback(callback: (config: Partial<SnippetConfig>) => void): void;

  /**
   * Dispatch a search with the query parameter.
   *
   * @param query - Query to be searched.
   *
   * @public
   */
  search(query?: string): void;

  /**
   * Method to initialize the XComponents app.
   *
   * @param config - {@link SnippetConfig} To receive the customer parameters.
   *
   * @public
   */
  init(config: SnippetConfig): void;
}

/**
 * Map type of every {@link XEvent} and a callback with the payload and metadata for that event.
 *
 * @public
 */
export type XEventListeners = Partial<
  {
    [Event in XEvent]: (payload: XEventPayload<Event>, metadata: WireMetadata) => void;
  }
>;

/**
 * Interface with the possible parameters to receive through the snippet integration.
 *
 * @public
 */
export interface SnippetConfig {
  /** Customer instance. */
  instance: string;
  /** Backend services environment. */
  env?: 'live' | 'staging';
  /** Execution scope (desktop, mobile, app, ...). */
  scope: string;
  /** Language to display. */
  lang: string;
  /** Language to send to backend services. */
  searchLang?: string;
  /** User GDPR consent. */
  consent?: boolean;
  /** Document direction. */
  documentDirection?: DocumentDirection;
  /** The currency name. There should be a currency format associated to this name in the app. */
  currency?: string;
  /** Callbacks to be triggered when an XEvent is emitted. */
  callbacks?: XEventListeners;
  /** Flag determining if the page is a single page application or not. */
  isSpa?: boolean;
  /** The id for the current product when product page is loaded. */
  productId?: string;
  /** Any extra param to send in all backend calls. */
  [extra: string]: any;
}
