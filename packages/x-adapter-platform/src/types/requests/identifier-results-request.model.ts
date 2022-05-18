import { PageableRequest, QueryableRequest, TrackableRequest } from '@empathyco/x-types';
import { PlatformExtraParamsRequest } from './request.types';

/**
 * Base request for the Platform Identifier Results endpoint.
 *
 * @public
 */
export interface BasePlatformIdentifierResultsRequest
  extends QueryableRequest,
    PageableRequest,
    TrackableRequest {}

/**
 * Request for Platform Identifier Results endpoint with extra params.
 *
 * @public
 */
export interface PlatformIdentifierResultsRequest
  extends BasePlatformIdentifierResultsRequest,
    PlatformExtraParamsRequest {}
