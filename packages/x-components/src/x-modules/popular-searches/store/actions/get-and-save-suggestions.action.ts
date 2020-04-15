import { PopularSearchesXStoreModule } from '../types';

/**
 * Default implementation for the {@link PopularSearchesActions.getAndSaveSuggestions}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A `void` promise that resolves when the suggestions finishes updating.
 */
//eslint-disable-next-line max-len
export const getAndSaveSuggestions: PopularSearchesXStoreModule['actions']['getAndSaveSuggestions'] = ({
  dispatch,
  commit
}) => dispatch('getSuggestions').then(suggestions => commit('setSuggestions', suggestions));
