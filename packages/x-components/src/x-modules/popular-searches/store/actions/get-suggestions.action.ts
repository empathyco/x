import { XPlugin } from '../../../../plugins/x-plugin';
import { PopularSearchesXStoreModule } from '../types';

/**
 * Default implementation for the {@link PopularSearchesActions.getSuggestions}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A Promise of Suggestion[] that resolves when it fetches suggestions.
 */
export const getSuggestions: PopularSearchesXStoreModule['actions']['getSuggestions'] = ({
  getters
}) => {
  return XPlugin.adapter.getSuggestions(getters.request).then(({ suggestions }) => suggestions);
};
