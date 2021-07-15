import { createStoreEmitters } from '../../../store';
import { relatedTagsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the related-tags module.
 *
 * @internal
 */
export const relatedTagsEmitters = createStoreEmitters(relatedTagsXStoreModule, {
  RelatedTagsChanged: state => state.relatedTags,
  RelatedTagsRequestChanged: (_, getters) => getters.request,
  SelectedRelatedTagsChanged: state => state.selectedRelatedTags
});
