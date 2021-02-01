import { XPlugin } from '../../../../plugins';
import { QuerySuggestionsXStoreModule } from '../types';

/**
 * Default implementation for the {@link QuerySuggestionsActions.fetchSuggestions}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @returns A `void` promise that resolves when it fetches suggestions.
 *
 * @public
 */
export const fetchSuggestions: QuerySuggestionsXStoreModule['actions']['fetchSuggestions'] = ({
  getters
}) => {
  return getters.request
    ? XPlugin.adapter.getSuggestions(getters.request).then(({ suggestions }) => suggestions)
    : [];
};
