import { ExtraParamsRequest, QueryableRequest } from './request.model';

/**
 * Request for Next Queries endpoint.
 *
 * @public
 */
export interface NextQueriesRequest extends QueryableRequest, ExtraParamsRequest {}
