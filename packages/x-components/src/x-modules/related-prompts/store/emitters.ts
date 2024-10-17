import { createStoreEmitters } from '../../../store';
import { relatedPromptsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the related-prompts module.
 */
export const relatedPromptsStoreEmitters = createStoreEmitters(relatedPromptsXStoreModule, {
  RelatedPromptsRequestUpdated: (_, getters) => getters.request
});
