import { PlatformExtraParamsRequest, PlatformQueryableRequest } from './request.types';

/**
 * Base request for the `related tags` endpoint.
 *
 * @public
 */
export interface BasePlatformRelatedTagsRequest extends PlatformQueryableRequest {}

/**
 * Request for the `related tags` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformRelatedTagsRequest
  extends BasePlatformRelatedTagsRequest,
    PlatformExtraParamsRequest {}
