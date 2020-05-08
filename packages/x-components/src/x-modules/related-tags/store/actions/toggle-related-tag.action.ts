import { RelatedTag } from '@empathy/search-types';
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
  { commit, state: { relatedTags, selectedRelatedTags } },
  relatedTag: RelatedTag
) => {
  const isRelatedTagSelected = selectedRelatedTags.includes(relatedTag);
  let newSelectedRelatedTags;
  let newRelatedTags;

  if (isRelatedTagSelected) {
    newSelectedRelatedTags = selectedRelatedTags.filter(rt => rt !== relatedTag);
    newRelatedTags = [...relatedTags, relatedTag];
  } else {
    newRelatedTags = relatedTags.filter(rt => rt !== relatedTag);
    newSelectedRelatedTags = [...selectedRelatedTags, relatedTag];
  }
  commit('setRelatedTags', newRelatedTags);
  commit('setSelectedRelatedTags', newSelectedRelatedTags);
};
