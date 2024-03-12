import { SemanticQuery, SemanticQueriesRequest } from '@empathyco/x-types';

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

  /**
   * The response list of semantic queries has changed.
   * Payload: The new {@link SemanticQuery | semantic query} list.
   */
  SemanticQueriesResponseChanged: SemanticQuery[];

  /**
   * The user has selected a semantic query.
   * Payload: The {@link SemanticQuery | semantic query} selected.
   */
  UserSelectedASemanticQuery: SemanticQuery;
}
