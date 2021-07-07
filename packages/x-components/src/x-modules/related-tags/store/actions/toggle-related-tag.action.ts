import { RelatedTag } from '@empathyco/x-types';
import { RelatedTagsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedTagsActions.toggleRelatedTag}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param relatedTag - The selected related tag.
 *
 * @public
 */
export const toggleRelatedTag: RelatedTagsXStoreModule['actions']['toggleRelatedTag'] = (
  { commit, state: { selectedRelatedTags } },
  relatedTag: RelatedTag
) => {
  const isRelatedTagSelected = selectedRelatedTags.includes(relatedTag);
  if (isRelatedTagSelected) {
    commit(
      'setSelectedRelatedTags',
      selectedRelatedTags.filter(rt => rt !== relatedTag)
    );
    commit('setRelatedTags', [relatedTag]);
  } else {
    commit('setSelectedRelatedTags', [...selectedRelatedTags, relatedTag]);
    commit('setRelatedTags', []);
  }
};
