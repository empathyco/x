import {
  PlatformExtraParamsRequest,
  PlatformPageableRequest,
  PlatformQueryableRequest
} from './request.types';

/**
 * Base request for the `query suggestions` endpoint.
 *
 * @public
 */
export interface BaseQuerySuggestionsRequest
  extends PlatformQueryableRequest,
    PlatformPageableRequest {}

/**
 * Request for `query suggestions` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformQuerySuggestionsRequest
  extends BaseQuerySuggestionsRequest,
    PlatformExtraParamsRequest {}
