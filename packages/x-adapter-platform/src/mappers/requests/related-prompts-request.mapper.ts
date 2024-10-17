import { schemaMapperFactory } from '@empathyco/x-adapter';

/**
 * Default implementation for the RelatedPromptsRequestMapper.
 *
 * @public
 */
export const relatedPromptsRequestMapper = schemaMapperFactory<any, any>({
  // randomize: () => true,
  lang: () => 'en',
  // scoreThreshold: () => 0.7,
  query: 'query'
});
