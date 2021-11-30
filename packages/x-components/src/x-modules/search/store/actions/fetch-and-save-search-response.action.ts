import { SearchResponse, SearchRequest } from '@empathyco/x-adapter';
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { SearchActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  SearchActionContext,
  SearchRequest | null,
  SearchResponse
>({
  fetch({ dispatch, state }, request) {
    const newRequest = request
      ? {
          ...request,
          // eslint-disable-next-line @typescript-eslint/no-extra-parens
          ...(state.origin && { origin: state.origin })
        }
      : null;
    return dispatch('fetchSearchResponse', newRequest);
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
