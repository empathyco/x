import { XPlugin } from '../../../../plugins/x-plugin';
import { QuerySuggestionsXStoreModule } from '../types';

/**
 * Default implementation for the {@link QuerySuggestionsActions.getSuggestions}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A `void` promise that resolves when it fetches suggestions.
 */
export const getSuggestions: QuerySuggestionsXStoreModule['actions']['getSuggestions'] = ({
  getters
}) => {
  return getters.request
    ? XPlugin.adapter.getSuggestions(getters.request).then(({ suggestions }) => suggestions)
    : [];
};
