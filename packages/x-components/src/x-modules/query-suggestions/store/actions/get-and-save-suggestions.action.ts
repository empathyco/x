import { QuerySuggestionsXStoreModule } from '../types';

/**
 * Default implementation for the {@link QuerySuggestionsActions.getAndSaveSuggestions}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns Promise.
 */
//eslint-disable-next-line max-len
export const getAndSaveSuggestions: QuerySuggestionsXStoreModule['actions']['getAndSaveSuggestions'] = ({
  dispatch,
  commit
}) => dispatch('getSuggestions').then(suggestions => commit('setSuggestions', suggestions));
