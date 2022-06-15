import { Suggestion, PopularSearchesRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { PopularSearchesActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  PopularSearchesActionContext,
  PopularSearchesRequest,
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
 * Default implementation for {@link PopularSearchesActions.fetchAndSaveSuggestions} action.
 *
 * @public
 */
export const fetchAndSaveSuggestions = fetchAndSave;

/**
 * Default implementation for {@link PopularSearchesActions.cancelFetchAndSaveSuggestions} action.
 *
 * @public
 */
export const cancelFetchAndSaveSuggestions = cancelPrevious;
