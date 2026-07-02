import type { Stats } from '@empathyco/x-types'
import type { BrowseXStoreModule } from '../types'

/**
 * Default implementation for the {@link BrowseActions.saveBrowseResponse}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param response - The {@link @empathyco/x-types#BrowseResponse} to save.
 * @public
 */
export const saveBrowseResponse: BrowseXStoreModule['actions']['saveBrowseResponse'] = (
  { commit, state, getters },
  { results, facets, banners, promoteds, totalResults, browseTagging, displayBrowseTagging, stats },
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
  }

  if (facets) {
    commit('setFacets', facets)
  }

  if (browseTagging) {
    commit('setBrowseTagging', browseTagging)
  }

  if (displayBrowseTagging) {
    commit('setDisplayBrowseTagging', displayBrowseTagging)
  }

  commit('setTotalResults', totalResults)
  commit('setStats', stats as Stats)
}
