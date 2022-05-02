import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.saveSearchResponse}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param response - The {@link @empathyco/x-adapter#SearchResponse} to save.
 *
 * @public
 */
export const saveSearchResponse: SearchXStoreModule['actions']['saveSearchResponse'] = (
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
) => {
  if (state.isAppendResults) {
    commit('appendResults', results);
  } else {
    commit('setResults', results);
    commit('setBanners', banners ?? []);
    commit('setPromoteds', promoteds ?? []);
    commit('setRedirections', redirections ?? []);
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
};
