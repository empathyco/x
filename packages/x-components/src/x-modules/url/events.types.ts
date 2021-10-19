import { UrlParams } from '../../types/url-params';

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
   * Url state changed with a change to add new entry to browser URL History State.
   * * Payload: The new URL params.
   */
  PushableUrlStateChanged: UrlParams;
  /**
   * Url state changed with a change to replace the current entry to browser URL History State.
   * * Payload: The new URL params.
   */
  ReplaceableUrlStateChanged: UrlParams;
}
