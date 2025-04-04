import type { RelatedPromptsResponse } from '@empathyco/x-types';
import type { PlatformRelatedPromptsResponse } from '../../types/responses/related-prompts-response.model';
 
import { schemaMapperFactory } from '@empathyco/x-adapter';
 
import { relatedPromptsResponseSchema } from '../../schemas/responses/related-prompts-response.schema';

/**
 * Default implementation for the RelatedPromptsResponseMapper.
 *
 * @public
 */
export const relatedPromptsResponseMapper = schemaMapperFactory<
  PlatformRelatedPromptsResponse,
  RelatedPromptsResponse
>(relatedPromptsResponseSchema);
