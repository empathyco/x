import { Dictionary } from '../../utils';

/**
 * Dictionary of the events of {@link ExtraParamsXModule}, where each key is the event name,
 * and the value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface ExtraParamsXEvents {
  UserChangedExtraParams: Dictionary<unknown>;
  ExtraParamsChanged: Dictionary<unknown>;
  ExtraParamsProvided: Dictionary<unknown>;
}
