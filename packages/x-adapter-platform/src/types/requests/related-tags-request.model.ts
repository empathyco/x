import { PlatformExtraParamsRequest, PlatformQueryableRequest } from './request.types';

/**
 * Request for the `related tags` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformRelatedTagsRequest
  extends PlatformQueryableRequest,
    PlatformExtraParamsRequest {}
