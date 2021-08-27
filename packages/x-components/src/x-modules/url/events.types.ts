import { UrlState } from './store/types';

/**
 * Dictionary of the events of URL XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface UrlXEvents {
  /**
   * Url state changed.
   * * Payload: none.
   */
  UrlStateChanged: UrlState;
}
