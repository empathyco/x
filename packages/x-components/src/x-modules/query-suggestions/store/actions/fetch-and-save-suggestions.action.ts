import { Suggestion } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/utils/fetch-and-save-action.helpers';
import { QuerySuggestionsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  QuerySuggestionsActionContext,
  Suggestion[]
>({
  fetch({ dispatch }) {
    return dispatch('fetchSuggestions');
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
