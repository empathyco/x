import { RelatedTag } from '@empathyco/x-types';
import { UrlParams } from '../../../../types/url-params';
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
  if (tag.length > 0) {
    commit('setSelectedRelatedTags', createRelatedTags(tag, query));
  }

  if (query) {
    commit('setQuery', query);
  }
};
