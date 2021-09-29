import { XPlugin } from '../../../../plugins/x-plugin';
import { PopularSearchesXStoreModule } from '../types';

/**
 * Default implementation for the {@link PopularSearchesActions.fetchSuggestions}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The popular searches request to make.
 * @returns A Promise of search response that resolves when it fetches the popular searches.
 *
 * @public
 */
export const fetchSuggestions: PopularSearchesXStoreModule['actions']['fetchSuggestions'] = (
  _,
  request
) => {
  return XPlugin.adapter
    .getSuggestions(request, { requestId: 'popularSearches' })
    .then(({ suggestions }) => suggestions);
};
