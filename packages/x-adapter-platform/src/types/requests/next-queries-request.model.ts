import { QueryableRequest } from '@empathyco/x-types';
import { PlatformExtraParamsRequest } from './request.types';

/**
 * Base request for Platform Next Queries endpoint.
 *
 * @public
 */
export interface BasePlatformNextQueriesRequest extends QueryableRequest {}

/**
 * Request for Platform Next Queries endpoint with extra params.
 *
 * @public
 */
export interface PlatformNextQueriesRequest
  extends BasePlatformNextQueriesRequest,
    PlatformExtraParamsRequest {}
