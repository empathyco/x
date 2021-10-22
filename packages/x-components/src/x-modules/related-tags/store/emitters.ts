import { createStoreEmitters } from '../../../store';
import { createEmitterArrayFilter } from '../../../utils/array';
import { relatedTagsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the related-tags module.
 *
 * @internal
 */
export const relatedTagsEmitters = createStoreEmitters(relatedTagsXStoreModule, {
  RelatedTagsChanged: state => state.relatedTags,
  RelatedTagsRequestChanged: (_, getters) => getters.request,
  SelectedRelatedTagsChanged: {
    selector: state => state.selectedRelatedTags,
    filter: createEmitterArrayFilter('tag')
  }
});
