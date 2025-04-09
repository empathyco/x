import type { SearchXStoreModule } from '../types'
import { createRelatedTagsQueryGetter } from '../../../../store/utils/query.utils'

/**
 * Default implementation for the search query getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the related
 * tags' module.
 *
 * @returns The query with the selected related tags concatenated.
 *
 * @public
 */
export const query: SearchXStoreModule['getters']['query'] = createRelatedTagsQueryGetter({
  getRelatedTags: state => state.relatedTags,
})
