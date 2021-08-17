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
   * Searches the query parameter as user query.
   *
   * @param query - Query to be searched.
   *
   * @public
   */
  search(query?: string): void {
    // TODO - It should do more things like emit the query was changed out of the normal user flow
    if (query) {
      this.bus?.emit('UserAcceptedAQuery', query);
    }
    this.bus?.emit('UserOpenXProgrammatically');
  }

  /**
   * Initializes the Application passing the {@link SnippetConfig}.
   *
   * @param config - The config comming from the customer snippet.
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
