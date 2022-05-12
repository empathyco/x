import { ExtraParamsRequest, PageableRequest, TrackableRequest } from './request.model';

/**
 * Request for Recommendations endpoint.
 *
 * @public
 */
export interface RecommendationsRequest
  extends PageableRequest,
    TrackableRequest,
    ExtraParamsRequest {}
