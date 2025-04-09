import type { ExtraParamsRequest, QueryableRequest } from './request.model';

/**
 * Request for the SemanticQueriesEndpoint.
 *
 * @public
 */
export interface SemanticQueriesRequest extends QueryableRequest, ExtraParamsRequest {}
