import { schemaMapperFactory } from '@empathyco/x-adapter';
import { RelatedPromptsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformRelatedPromptsResponse } from '../../types/responses/related-prompts-response.model';
// eslint-disable-next-line max-len
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
