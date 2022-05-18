import {
  ExtraParamsRequest,
  PageableRequest,
  QueryableRequest,
  TrackableRequest
} from './request.model';

/**
 * Request for Identifier Results endpoint.
 *
 * @public
 */
export interface IdentifierResultsRequest
  extends QueryableRequest,
    PageableRequest,
    TrackableRequest,
    ExtraParamsRequest {}
