import { Dictionary } from '../../utils';

/**
 * Dictionary of the events of {@link ExtraParamsXModule}, where each key is the event name,
 * and the value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface ExtraParamsXEvents {
  /**
   * The user changed the extra params.
   * * Payload: The new extra params dictionary.
   */
  UserChangedExtraParams: Dictionary<unknown>;
  /**
   * The Extra Params have been changed.
   * * Payload: The new extra params dictionary.
   */
  ExtraParamsChanged: Dictionary<unknown>;
  /**
   * The Extra Params have been provided.
   * * Payload: The new extra params dictionary.
   */
  ExtraParamsProvided: Dictionary<unknown>;
  /**
   * The Initial Extra Params have been loaded into the state.
   * * Payload: The new extra params dictionary.
   */
  ExtraParamsInitialized: Dictionary<unknown>;
}
