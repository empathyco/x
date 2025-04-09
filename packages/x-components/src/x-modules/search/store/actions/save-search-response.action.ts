import type { Stats } from '@empathyco/x-types'
import type { SearchXStoreModule } from '../types'

/**
 * Default implementation for the {@link SearchActions.saveSearchResponse}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param context.commit - commit context.
 * @param context.state - state context.
 * @param context.getters - getters context.
 * @param response - The {@link @empathyco/x-types#SearchResponse} to save.
 * @param response.results - results response.
 * @param response.partialResults - partialResults response.
 * @param response.facets - facets response.
 * @param response.banners - banners response.
 * @param response.promoteds - promoteds response.
 * @param response.totalResults - totalResults response.
 * @param response.spellcheck - spellcheck response.
 * @param response.redirections - redirections response.
 * @param response.queryTagging - queryTagging response.
 * @param response.displayTagging - displayTagging response.
 * @param response.stats - stats response.
 *
 * @public
 */
export const saveSearchResponse: SearchXStoreModule['actions']['saveSearchResponse'] = (
  { commit, state, getters },
  {
    results,
    partialResults,
    facets,
    banners,
    promoteds,
    totalResults,
    spellcheck,
    redirections,
    queryTagging,
    displayTagging,
    stats,
  },
) => {
  if (totalResults === 0) {
    commit('setIsNoResults', true)
    if (getters.request && Object.keys(getters.request.filters!).length > 0) {
      commit('setSelectedFilters', [])
      commit('setFromNoResultsWithFilters', true)
    }
  } else {
    commit('setIsNoResults', false)
  }

  if (state.isAppendResults) {
    commit('appendResults', results)
  } else {
    commit('setResults', results)
    commit('setBanners', banners ?? [])
    commit('setPromoteds', promoteds ?? [])
    commit('setRedirections', redirections ?? [])
  }

  commit('setPartialResults', partialResults ?? [])

  if (facets) {
    commit('setFacets', facets)
  }

  if (queryTagging) {
    commit('setQueryTagging', queryTagging)
  }

  if (displayTagging) {
    commit('setDisplayTagging', displayTagging)
  }

  commit('setTotalResults', totalResults)
  commit('setSpellcheck', spellcheck ?? '')
  commit('setStats', stats as Stats)
}
