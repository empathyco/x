import type { FacetsXStoreModule, FiltersByFacet } from '../types'
import { isFacetFilter } from '@empathyco/x-types'
import { map } from '@empathyco/x-utils'
import { groupItemsBy } from '../../../../utils/array'
import { UNKNOWN_FACET_KEY } from '../constants'

/**
 * Default implementation for the {@link FacetsGetters.selectedFiltersByFacet} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * facets' module.
 *
 * @returns A record containing the selected filters indexed by its facet id.
 * @remarks If there are filters without facetId (RawFilter), they will be grouped under
 * the UNKNOWN_FACET_KEY constant.
 *
 * @public
 */
export const selectedFiltersByFacet: FacetsXStoreModule['getters']['selectedFiltersByFacet'] = (
  state,
  getters,
): FiltersByFacet => {
  // The `emptyRecord` is to return an empty array for those facets that haven't selected filters.
  const emptyRecord: FiltersByFacet = map(state.facets, () => [])
  const filtersByFacet = groupItemsBy(getters.selectedFilters, filter =>
    isFacetFilter(filter) ? filter.facetId : UNKNOWN_FACET_KEY,
  )
  return Object.assign(emptyRecord, filtersByFacet)
}
