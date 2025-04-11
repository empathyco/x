import type { RelatedTag } from '@empathyco/x-types'
import type { UrlParams } from '../../../../types/url-params'
import type { RelatedTagsXStoreModule } from '../types'

/**
 * Helper method which creates the {@link RelatedTag} entity from the string array `tag` of the url.
 *
 * @param tags - List of tags from the url.
 * @param query - Query from the url.
 *
 * @returns A list of {@link RelatedTag | related tags}.
 */
function createRelatedTags(tags: string[], query: string): RelatedTag[] {
  return tags.map(tag => ({
    tag,
    modelName: 'RelatedTag',
    query: query ? `${query} ${tag}` : '',
  }))
}

/**
 * Default implementation for the {@link RelatedTagsActions.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param context.commit - commit context.
 * @param urlParams - The url params from the url.
 * @param urlParams.query - query urlParams.
 * @param urlParams.tag - tag urlParams.
 *
 * @public
 */
export const setUrlParams: RelatedTagsXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { query, tag }: UrlParams,
) => {
  commit('setSelectedRelatedTags', createRelatedTags(tag, query))
  commit('setQuery', query)
}
