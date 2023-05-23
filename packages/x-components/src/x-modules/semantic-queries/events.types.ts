import { SemanticQueriesRequest } from '@empathyco/x-types';

/**
 * Dictionary of the events of SemanticQueries XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface SemanticQueriesXEvents {
  /**
   * Any property of the semantic queries request has changed.
   * Payload: The new {@link @empathyco/x-types#SearchRequest | request}.
   */
  SemanticQueryRequestUpdated: SemanticQueriesRequest | null;
  /**
   * The component that shows a Semantic query has been unmounted.
   * Payload: The query whose preview has been removed.
   */
  SemanticQueryUnmountedHook: string;
}
