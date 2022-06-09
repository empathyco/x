import { PlatformExtraParamsRequest, PlatformQueryableRequest } from './request.types';

/**
 * Base request for the `next queries` endpoint.
 *
 * @public
 */
export interface BasePlatformNextQueriesRequest extends PlatformQueryableRequest {}

/**
 * Request for the `next queries` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformNextQueriesRequest
  extends BasePlatformNextQueriesRequest,
    PlatformExtraParamsRequest {}
