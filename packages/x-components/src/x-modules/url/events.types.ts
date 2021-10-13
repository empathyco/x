import { UrlParams } from './store/types';
/**
 * Dictionary of the events of URL XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface UrlXEvents {
  /**
   * Url loaded from the url changed.
   * * Payload: The new URL params.
   */
  ParamsLoadedFromUrl: UrlParams;
  /**
   * Url state changed.
   * * Payload: The new URL params.
   */
  PushableUrlStateChanged: UrlParams;
  /**
   * Url state changed.
   * * Payload: The new URL params.
   */
  ReplaceableUrlStateChanged: UrlParams;
}
