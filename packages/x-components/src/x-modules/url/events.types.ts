import { UrlConfig } from './config.types';
import { UrlGetters } from './store/types';
/**
 * Dictionary of the events of URL XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface UrlXEvents {
  /**
   * The configuration for handling the URL has changed.
   * * Payload: The new URL config.
   */
  UrlConfigProvided: UrlConfig;
  /**
   * Url state changed.
   * * Payload: The new URL params.
   */
  UrlStateChanged: UrlGetters['urlParams'];
  /**
   * Url loaded from the url changed.
   * * Payload: The new URL params.
   */
  ParamsLoadedFromUrl: UrlGetters['urlParams'];
  /**
   * Document has finished loading.
   * * Payload: The URL string.
   */
  DocumentLoaded: string;
  /**
   * Extra params has been loaded from the URL.
   * * Payload: The extra params array.
   */
  ExtraParamsLoadedFromUrl: string[];
  /**
   * Url has changed.
   * Payload: The new URL params.
   */
  UrlChanged: UrlGetters['urlParams'];
}
