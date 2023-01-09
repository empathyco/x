import { ExtraParamsRequest, PageableRequest } from './request.model';

/**
 * Request for Popular Searches endpoint.
 *
 * @public
 */
export interface PopularSearchesRequest extends PageableRequest, ExtraParamsRequest {}
