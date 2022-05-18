import {
  QueryableRequest,
  PageableRequest,
  SortableRequest,
  TrackableRequest
} from '@empathyco/x-types';
import { PlatformExtraParamsRequest, PlatformFilterableRequest } from './request.types';

/**
 * Request for Platform Search endpoint.
 *
 * @public
 */
export interface BasePlatformSearchRequest
  extends QueryableRequest,
    PageableRequest,
    PlatformFilterableRequest,
    TrackableRequest,
    SortableRequest {}

/**
 * Request for Platform Search endpoint with extra params.
 *
 * @public
 */
export interface PlatformSearchRequest
  extends BasePlatformSearchRequest,
    PlatformExtraParamsRequest {}
