import type { BrowseRequest, BrowseResponse } from '@empathyco/x-types'
import type { BrowseActionContext } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

export const { fetchAndSave: browseAndSave, cancelPrevious: cancelBrowse } =
  createFetchAndSaveActions<BrowseActionContext, BrowseRequest | null, BrowseResponse>({
    fetch: async ({ dispatch }, request) => dispatch('browse', request),
    onSuccess(
      { commit, getters, state },
      { results, facets, totalResults, browseTagging, displayTagging },
    ) {
      commit('setResults', state.shouldAppendResults ? [...state.results, ...results] : results)
      commit('setFacets', facets ?? [])
      commit('setTotalResults', totalResults)

      if (browseTagging) {
        commit('setBrowseTagging', browseTagging)
      }

      if (displayTagging) {
        commit('setDisplayTagging', displayTagging)
      }

      if (state.selectedCategory && totalResults === 0) {
        commit('setIsNoResults', true)
      } else {
        commit('setIsNoResults', false)
      }
      commit('setShouldAppendResults', false)
      if (!getters.browseRequest) {
        commit('setPage', 1)
      }
    },
  })
