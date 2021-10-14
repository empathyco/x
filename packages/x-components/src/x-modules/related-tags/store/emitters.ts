import { createStoreEmitters } from '../../../store';
import { createArrayComparator } from '../../../utils/array';
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
    filter: createArrayComparator('tag')
  }
});
