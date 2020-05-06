import { PropsWithType } from '../../utils/types';
import { XEventsTypes } from '../../wiring/events.types';

/**
 * Configuration options for the {@link NoSuggestionsXModule}.
 *
 * @public
 */
export interface NoSuggestionsConfig {
  /**
   * Array of events to be listened with any array as payload {@link XEventArrayPayload}. When
   * the array payload of each event is empty, the no-suggestions will be rendered.
   */
  eventsToRender: XEventArrayPayload[];
}

/**
 * Event names of {@link XEventsTypes} available with an any array as payload.
 *
 * @public
 */
export type XEventArrayPayload = PropsWithType<XEventsTypes, any[]>;
