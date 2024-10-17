import { schemaMapperFactory } from '@empathyco/x-adapter';

/**
 * Default implementation for the RelatedPromptsResponseMapper.
 *
 * @public
 */
export const relatedPromptsResponseMapper = schemaMapperFactory<any, any>({
  relatedPromptsProducts: response => response.data?.relatedprompts ?? []
});
