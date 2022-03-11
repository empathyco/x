import { RelatedTag } from '@empathyco/x-types';
import { UrlParams } from '../../../../types/url-params';
import { RelatedTagsXStoreModule } from '../types';

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
    query: query ? `${query} ${tag}` : ''
  }));
}

/**
 * Default implementation for the {@link RelatedTagsActions.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param urlParams - The url params from the url.
 *
 * @public
 */
export const setUrlParams: RelatedTagsXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { query, tag }: UrlParams
) => {
  commit('setSelectedRelatedTags', createRelatedTags(tag, query));
  commit('setRelatedTags', []);
  commit('setQuery', query);
};
