import { SearchRequest, SearchResponse } from '@empathyco/x-types';
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { InternalSearchRequest } from '../../types';
import { SearchActionContext, SearchState } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  SearchActionContext,
  InternalSearchRequest | null,
  SearchResponse
>({
  fetch({ dispatch, state }, request) {
    return dispatch('fetchSearchResponse', request ? enrichRequest(request, state) : null);
  },
  onSuccess({ dispatch }, response) {
    dispatch('saveSearchResponse', response);
  }
});

/**
 * Enriches the {@link SearchRequest} object with the origin and page properties taken from the
 * {@link SearchState | search state}.
 *
 * @param request - The {@link InternalSearchRequest}.
 * @param state - {@link SearchState}.
 *
 * @returns The search request.
 * @internal
 */
function enrichRequest(request: InternalSearchRequest, state: SearchState): SearchRequest {
  const { page, ...restRequest } = request;
  const {
    config: { pageSize },
    origin,
    results
  } = state;
  const start = page === 1 ? 0 : results.length;

  return {
    ...restRequest,
    ...(origin && { origin }),
    start,
    rows: pageSize * page - start
  };
}

/**
 * Default implementation for {@link SearchActions.fetchAndSaveSearchResponse} action.
 *
 * @public
 */
export const fetchAndSaveSearchResponse = fetchAndSave;

/**
 * Default implementation for {@link SearchActions.cancelFetchAndSaveSearchResponse} action.
 *
 * @public
 */
export const cancelFetchAndSaveSearchResponse = cancelPrevious;
