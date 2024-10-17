import { schemaMapperFactory } from '@empathyco/x-adapter';
import { RelatedPromptsRequest } from '@empathyco/x-types';

/**
 * Default implementation for the RelatedPromptsRequestMapper.
 */
export const relatedPromptsRequestMapper = schemaMapperFactory<RelatedPromptsRequest, any>({
  // randomize: () => true,
  lang: () => 'en',
  // scoreThreshold: () => 0.7,
  query: 'query'
});
