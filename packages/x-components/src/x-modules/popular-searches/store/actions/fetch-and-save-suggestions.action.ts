import { Suggestion } from '@empathy/search-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/utils/helpers/fetch-and-save-action.helpers';
import { PopularSearchesActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  PopularSearchesActionContext,
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
