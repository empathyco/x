import { QueryableRequest } from '@empathyco/x-types';
import { PlatformExtraParamsRequest } from './request.types';

/**
 * Base request for the Platform Related Tags endpoint.
 *
 * @public
 */
export interface BasePlatformRelatedTagsRequest extends QueryableRequest {}

/**
 * Request for Platform Related Tags endpoint with extra params.
 *
 * @public
 */
export interface PlatformRelatedTagsRequest
  extends BasePlatformRelatedTagsRequest,
    PlatformExtraParamsRequest {}
