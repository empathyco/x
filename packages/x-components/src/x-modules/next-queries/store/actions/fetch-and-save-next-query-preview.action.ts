import { SearchResponse } from '@empathyco/x-types';
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { NextQueriesActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  NextQueriesActionContext,
  string,
  SearchResponse
>({
  fetch({ dispatch }, request: string): Promise<SearchResponse> {
    return dispatch('fetchNextQueryPreview', request);
  },
  onSuccess(_context, response: SearchResponse) {
    return response;
  }
});

export const fetchAndSaveNextQueryPreview = fetchAndSave;

export const cancelFetchAndSaveNextQueryPreview = cancelPrevious;
