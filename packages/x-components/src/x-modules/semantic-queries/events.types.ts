import { SemanticQueriesRequest } from '@empathyco/x-types';

/**
 * Dictionary of the events of {@link SemanticQueriesXModule},where each key
 * is the event name, and the value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface SemanticQueriesXEvents {
  /**
   * Any property of the semantic queries request has changed.
   * Payload: The new {@link @empathyco/x-types#SemanticQueriesRequest | request}.
   */
  SemanticQueryRequestUpdated: SemanticQueriesRequest | null;
}
