import { createStoreEmitters } from '../../../store';
import { relatedPromptsXStoreModule } from './module';

export const relatedPromptsStoreEmitters = createStoreEmitters(relatedPromptsXStoreModule, {
  RelatedPromptsRequestUpdated: (_, getters) => getters.request
});
