import { XPlugin } from '../../../../plugins';
import { QuerySuggestionsXStoreModule } from '../types';

/**
 * Default implementation for the {@link QuerySuggestionsActions.fetchSuggestions}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The query suggestions request to make.
 *
 * @returns A `void` promise that resolves when it fetches suggestions.
 *
 * @public
 */
export const fetchSuggestions: QuerySuggestionsXStoreModule['actions']['fetchSuggestions'] = (
  _,
  request
) => {
  return request
    ? XPlugin.adapter.getSuggestions(request).then(({ suggestions }) => suggestions)
    : [];
};
