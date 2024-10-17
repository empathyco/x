import { schemaMapperFactory } from '@empathyco/x-adapter';
import { RelatedPromptsResponse } from '@empathyco/x-types';

/**
 * Default implementation for the RelatedPromptsResponseMapper.
 *
 * @public
 */
export const relatedPromptsResponseMapper = schemaMapperFactory<any, RelatedPromptsResponse>({
  relatedPromptsProducts: response => response.data?.relatedprompts ?? []
});
