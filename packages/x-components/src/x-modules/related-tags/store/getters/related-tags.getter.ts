import type { RelatedTagsXStoreModule } from '../types'

/**
 * Default implementation for the {@link RelatedTagsGetters.relatedTags} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the related
 * tags module.
 * @param state.relatedTags - relatedTags state.
 * @param state.selectedRelatedTags - selectedRelatedTags state.
 * @returns The related tags.
 *
 * @public
 */
export const relatedTags: RelatedTagsXStoreModule['getters']['relatedTags'] = ({
  relatedTags,
  selectedRelatedTags,
}) => [...selectedRelatedTags, ...relatedTags]
