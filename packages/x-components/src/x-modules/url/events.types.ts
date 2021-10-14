import { UrlParams } from '../../types/url-params';
import { Dictionary } from '../../utils/types';

/**
 * Dictionary of the events of URL XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface UrlXEvents {
  /**
   * Url loaded.
   * * Payload: The new {@link UrlParams} params.
   */
  ParamsLoadedFromUrl: UrlParams;
  /**
   * Url loaded.
   * * Payload: The extra params form URL in form of {@link Dictionary} with `unknown` values.
   */
  ExtraParamsLoadedFromUrl: Dictionary<unknown>;
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
