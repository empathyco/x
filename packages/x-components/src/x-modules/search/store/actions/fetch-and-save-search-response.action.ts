import { SearchResponse } from '@empathy/search-adapter';
// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/utils/helpers/fetch-and-save-action.helpers';
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
    { results, partialResults, facets, banners, promoteds, totalResults, spellcheck }
  ) {
    if (state.isAppendResults) {
      commit('appendResults', results);
      commit('setIsAppendResults', false);
    } else {
      commit('setResults', results);
    }

    commit('setPartialResults', partialResults ?? []);

    if (facets) {
      commit('setFacets', facets);
    }

    commit('setBanners', banners);
    commit('setPromoteds', promoteds);
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
