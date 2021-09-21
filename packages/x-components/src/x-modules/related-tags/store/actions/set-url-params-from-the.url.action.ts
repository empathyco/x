import { RelatedTag } from '@empathyco/x-types';
import { Dictionary } from '../../../../utils';
import { UrlParamValue } from '../../../url';
import { RelatedTagsXStoreModule } from '../types';

/**
 * Helper method which created the {@link RelatedTag} entity from the string of the url.
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
      query: query ?? '',
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
  ({ commit }, urlParams: Dictionary<UrlParamValue>) => {
    if (urlParams.relatedTags) {
      commit(
        'setSelectedRelatedTags',
        createRelatedTags(urlParams.relatedTags as string[], urlParams.query as string)
      );
    }

    if (urlParams.query) {
      commit('setQuery', urlParams.query as string);
    }
  };
