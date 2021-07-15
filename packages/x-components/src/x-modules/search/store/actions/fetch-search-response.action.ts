import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.fetchSearchResponse}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A Promise of search response that resolves when it fetches search response.
 *
 * @public
 */
export const fetchSearchResponse: SearchXStoreModule['actions']['fetchSearchResponse'] = ({
  getters
}) => {
  return getters.request
    ? XPlugin.adapter.search(getters.request)
    : {
        banners: [],
        facets: [],
        partialResults: [],
        promoteds: [],
        queryTagging: {
          params: {},
          url: ''
        },
        redirections: [],
        results: [],
        spellcheck: '',
        totalResults: 0
      };
};
