import { PlatformExtraParamsRequest, PlatformQueryableRequest } from './request.types';

/**
 * Request for the `related prompts` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformRelatedPromptsRequest
  extends PlatformQueryableRequest,
    PlatformExtraParamsRequest {}
