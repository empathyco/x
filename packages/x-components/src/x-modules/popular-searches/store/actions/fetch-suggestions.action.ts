import { XPlugin } from '../../../../plugins/x-plugin';
import { PopularSearchesXStoreModule } from '../types';

/**
 * Default implementation for the {@link PopularSearchesActions.fetchSuggestions}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @returns A Promise of Suggestion[] that resolves when it fetches suggestions.
 *
 * @public
 */
export const fetchSuggestions: PopularSearchesXStoreModule['actions']['fetchSuggestions'] = ({
  getters
}) => {
  return XPlugin.adapter.getSuggestions(getters.request).then(({ suggestions }) => suggestions);
};
