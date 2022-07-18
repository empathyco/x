import { SearchResponse } from '@empathyco/x-types';
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { NextQueriesActionContext } from '../types';

let nextQuery = '';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  NextQueriesActionContext,
  string,
  SearchResponse | null
>({
  fetch({ dispatch }, request: string) {
    nextQuery = request;
    return dispatch('fetchNextQueryPreview', request);
  },
  onSuccess({ commit }, response: SearchResponse) {
    commit('setResults', {
      nextQuery,
      results: {
        totalResults: response.totalResults,
        items: response.results
      }
    });
  }
});

export const fetchAndSaveNextQueryPreview = fetchAndSave;

export const cancelFetchAndSaveNextQueryPreview = cancelPrevious;
