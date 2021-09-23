import { SearchResponse } from '@empathyco/x-adapter';
// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/utils/fetch-and-save-action.utils';
import { SearchActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  SearchActionContext,
  SearchResponse
>({
  fetch({ dispatch }) {
    return dispatch('fetchSearchResponse');
  },
  onSuccess(
    { commit, state },
    { results, partialResults, facets, banners, promoteds, totalResults, spellcheck, redirections }
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
