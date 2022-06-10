import { PlatformExtraParamsRequest, PlatformQueryableRequest } from './request.types';

/**
 * Request for the `next queries` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformNextQueriesRequest
  extends PlatformQueryableRequest,
    PlatformExtraParamsRequest {}
