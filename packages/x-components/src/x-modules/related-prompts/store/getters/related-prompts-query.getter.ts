import type { RelatedPromptsXStoreModule } from '../types'
import { createRelatedTagsQueryGetter } from '../../../../store/utils/query.utils'

/**
 * Default implementation for the related prompts query getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the related
 * prompts' module.
 *
 * @returns The query with the selected related tags concatenated.
 *
 * @public
 */
export const query: RelatedPromptsXStoreModule['getters']['query'] = createRelatedTagsQueryGetter({
  getRelatedTags: state => state.relatedTags,
})
