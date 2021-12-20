import { SearchResponse, SearchRequest } from '@empathyco/x-adapter';
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { PageableSearchRequest } from '../../types';
import { SearchActionContext, SearchState } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  SearchActionContext,
  PageableSearchRequest | null,
  SearchResponse
>({
  fetch({ dispatch, state }, request) {
    return dispatch('fetchSearchResponse', request ? enrichRequest(request, state) : null);
  },
  onSuccess(
    { commit, state },
    {
      results,
      partialResults,
      facets,
      banners,
      promoteds,
      totalResults,
      spellcheck,
      redirections,
      queryTagging
    }
  ) {
    if (state.isAppendResults) {
      commit('appendResults', results);
    } else {
      commit('setResults', results);
      commit('setBanners', banners);
      commit('setPromoteds', promoteds);
      commit('setRedirections', redirections);
    }

    commit('setPartialResults', partialResults ?? []);

    if (facets) {
      commit('setFacets', facets);
    }

    if (queryTagging) {
      commit('setQueryTagging', queryTagging);
    }
    commit('setTotalResults', totalResults);
    commit('setSpellcheck', spellcheck ?? '');
  }
});

/**
 * Enriches the {@link SearchRequest} object with the origin and page properties taken from the
 * {@link SearchState | search state}.
 *
 * @param request - The {@link PageableSearchRequest}.
 * @param state - {@link SearchState}.
 *
 * @returns The search request.
 * @internal
 */
function enrichRequest(request: PageableSearchRequest, state: SearchState): SearchRequest {
  const { page, ...restRequest } = request;
  const {
    config: { pageSize },
    origin,
    results
  } = state;
  const start = page === 1 ? 0 : results.length;

  return {
    ...restRequest,
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
    ...(origin && { origin }),
    start,
    rows: pageSize * page! - start
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
