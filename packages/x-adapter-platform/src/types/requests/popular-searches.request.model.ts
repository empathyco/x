import { PageableRequest } from '@empathyco/x-types';
import { PlatformExtraParamsRequest } from './request.types';

/**
 * Base request for the Platform Popular Searches endpoint.
 *
 * @public
 */
export interface BasePlatformPopularSearchesRequest extends PageableRequest {}

/**
 * Request for Platform Popular Searches endpoint with extra params.
 *
 * @public
 */
export interface PlatformPopularSearchesRequest
  extends BasePlatformPopularSearchesRequest,
    PlatformExtraParamsRequest {}
