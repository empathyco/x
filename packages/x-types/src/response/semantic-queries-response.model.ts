import { SemanticQuery } from '../query-signals/semantic-query.model';

/**
 * Response for the semantic queries endpoint.
 *
 * @public
 */
export interface SemanticQueriesResponse {
  semanticQueries: SemanticQuery[];
}
