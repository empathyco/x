import type { Facet, FacetsRequest, FacetsResponse, Filter } from '@empathyco/x-types'
import type { FacetsActionsContext } from '../types'
import { isHierarchicalFacet } from '@empathyco/x-types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'
import { applyHierarchicalSelection, flattenAllFilters } from '../../utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  FacetsActionsContext,
  FacetsRequest | null,
  FacetsResponse | null
>({
  async fetch({ dispatch }, request) {
    return request ? dispatch('fetchFacetsResponse', request) : Promise.resolve(null)
  },
  onSuccess({ commit, getters }, response) {
    if (response !== null) {
      const selectedFilters = getters.selectedFilters
      const selectedIds = new Set(
        selectedFilters.filter((f: Filter) => f.selected).map((f: Filter) => f.id),
      )
      const facetsWithSelectedFilters: Facet[] = []

      response.facets?.forEach((facet: Facet) => {
        if (isHierarchicalFacet(facet)) {
          applyHierarchicalSelection(facet.filters, selectedIds)
        } else {
          facet.filters.forEach((filter: Filter) => {
            filter.selected = selectedIds.has(filter.id)
          })
        }

        facetsWithSelectedFilters.push(facet)
        commit('setFacet', facet)
      })

      commit('setFilters', flattenAllFilters(facetsWithSelectedFilters))
    }
  },
})

/**
 * Default implementation for {@link FacetsActions.fetchAndSaveFacetsResponse} action.
 *
 * @public
 */
export const fetchAndSaveFacetsResponse = fetchAndSave

/**
 * Default implementation for {@link FacetsActions.cancelFetchAndSaveFacetsResponse} action.
 *
 * @public
 */
export const cancelFetchAndSaveFacetsResponse = cancelPrevious
