import { ExtraParamsRequest, PageableRequest, QueryableRequest } from './request.model';

/**
 * Request for Query Suggestions endpoint.
 *
 * @public
 */
export interface QuerySuggestionsRequest
  extends QueryableRequest,
    PageableRequest,
    ExtraParamsRequest {}
