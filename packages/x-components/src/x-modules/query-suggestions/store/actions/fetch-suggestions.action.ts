import { XPlugin } from '../../../../plugins';
import { QuerySuggestionsXStoreModule } from '../types';

/**
 * Default implementation for the {@link QuerySuggestionsActions.fetchSuggestions}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The query suggestions request to make.
 *
 * @returns A `void` promise that resolves when it fetches suggestions.
 *
 * @public
 */
export const fetchSuggestions: QuerySuggestionsXStoreModule['actions']['fetchSuggestions'] = (
  _context,
  request
) => {
  return request
    ? XPlugin.adapter.querySuggestions(request).then(({ suggestions }) => suggestions)
    : [];
};
