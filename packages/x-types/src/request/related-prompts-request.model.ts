import type { ExtraParamsRequest, QueryableRequest } from './request.model';

/**
 * Request for Related Prompts endpoint.
 *
 * @public
 */
export interface RelatedPromptsRequest extends QueryableRequest, ExtraParamsRequest {}
