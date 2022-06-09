import { ExtraParamsRequest, PageableRequest, QueryableRequest } from './request.model';

/**
 * Request for Related Tags endpoint.
 *
 * @public
 */
export interface RelatedTagsRequest extends QueryableRequest, PageableRequest, ExtraParamsRequest {}
