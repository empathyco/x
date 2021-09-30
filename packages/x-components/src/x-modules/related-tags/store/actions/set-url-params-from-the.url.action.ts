import { RelatedTag } from '@empathyco/x-types';
import { RelatedTagsXStoreModule } from '../types';

/**
 * Helper method which creates the {@link RelatedTag} entity from the string of the url.
 *
 * @param relatedTags - List of related tags as strings from the url.
 * @param query - Query from the url.
 *
 * @returns A list of {@link RelatedTag | related tags}.
 */
const createRelatedTags = (relatedTags: string[], query: string): RelatedTag[] => {
  return relatedTags.reduce<RelatedTag[]>((acc, relatedTag) => {
    acc.push({
      tag: relatedTag,
      modelName: 'RelatedTag',
      selected: true,
      query: query ? `${query} ${relatedTag}` : '',
      previous: ''
    });
    return acc;
  }, []);
};

/**
 * Default implementation for the {@link RelatedTagsActions.setUrlParamsFromTheUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param urlParams - The url params from the url.
 *
 * @public
 */
export const setUrlParamsFromTheUrl: RelatedTagsXStoreModule['actions']['setUrlParamsFromTheUrl'] =
  ({ commit }, { query, relatedTags }) => {
    const newQuery = query as string;
    const newRelatedTags = relatedTags as string[];

    if (relatedTags) {
      commit('setSelectedRelatedTags', createRelatedTags(newRelatedTags, newQuery));
    }

    if (query) {
      commit('setQuery', newQuery);
    }
  };
