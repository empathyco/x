import { QuerySuggestionsRequest, Suggestion } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { QuerySuggestionsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  QuerySuggestionsActionContext,
  QuerySuggestionsRequest | null,
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
