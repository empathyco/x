import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.fetchSearchResponse}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The search request to make.
 * @returns A Promise of search response that resolves when it fetches search response.
 *
 * @public
 */
export const fetchSearchResponse: SearchXStoreModule['actions']['fetchSearchResponse'] = (
  _context,
  request
) => {
  return request
    ? XPlugin.platformAdapter.search(request)
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
