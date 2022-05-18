import { PageableRequest, QueryableRequest } from '@empathyco/x-types';
import { PlatformExtraParamsRequest } from './request.types';

/**
 * Base request for the Platform Query Suggestions endpoint.
 *
 * @public
 */
export interface BaseQuerySuggestionsRequest extends QueryableRequest, PageableRequest {}

/**
 * Request for Platform Query Suggestions endpoint with extra params.
 *
 * @public
 */
export interface PlatformQuerySuggestionsRequest
  extends BaseQuerySuggestionsRequest,
    PlatformExtraParamsRequest {}
