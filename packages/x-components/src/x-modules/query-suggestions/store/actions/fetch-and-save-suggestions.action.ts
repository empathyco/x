import { SuggestionsRequest } from '@empathyco/x-adapter';
import { Suggestion } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/utils/fetch-and-save-action.utils';
import { QuerySuggestionsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  QuerySuggestionsActionContext,
  SuggestionsRequest | null,
  Suggestion[]
>({
  fetch({ dispatch }, request) {
    return dispatch('fetchSuggestions', request);
  },
  onSuccess({ commit }, suggestions) {
    commit('setSuggestions', suggestions);
  }
});

/**
 * Default implementation for {@link QuerySuggestionsActions.fetchAndSaveSuggestions} action.
 *
 * @public
 */
export const fetchAndSaveSuggestions = fetchAndSave;

/**
 * Default implementation for {@link QuerySuggestionsActions.cancelFetchAndSaveSuggestions} action.
 *
 * @public
 */
export const cancelFetchAndSaveSuggestions = cancelPrevious;
