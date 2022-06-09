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
export interface PlatformQuerySuggestionsRequest
  extends PlatformQueryableRequest,
    PlatformExtraParamsRequest,
    PlatformPageableRequest {}
