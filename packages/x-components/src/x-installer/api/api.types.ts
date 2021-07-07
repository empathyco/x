import { XBus } from '../../plugins/x-bus.types';
import { DocumentDirection } from '../../plugins/x-plugin.types';

/**
 * Interface with the API functions exposes as X
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window | window} property.
 *
 * @public
 */
export interface XAPI {
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
   * Dispatch a search with the query parameter.
   *
   * @param query - Query to be searched.
   *
   * @public
   */
  search(query: string): void;

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
  /** Any extra param to send in all backend calls. */
  [extra: string]: any;
}
