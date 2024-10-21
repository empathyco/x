import { schemaMapperFactory } from '@empathyco/x-adapter';
import { RelatedPromptsRequest } from '@empathyco/x-types';
import { PlatformRelatedPromptsRequest } from '../../types/requests/related-prompts-request.model';
import { relatedPromptsRequestSchema } from '../../schemas/requests/related-prompts-request.schema';

/**
 * Default implementation for the RelatedPromptsRequestMapper.
 */
export const relatedPromptsRequestMapper = schemaMapperFactory<
  RelatedPromptsRequest,
  PlatformRelatedPromptsRequest
>(relatedPromptsRequestSchema);
