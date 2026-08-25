import type { BooleanFilter, Filter } from '@empathyco/x-types'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../store/store.types'
import type { FilterEntity } from './types'
import { isBooleanFilter } from '@empathyco/x-types'
import { addFacetIfNotPresent } from './add-facet-if-not-present'

/**
 * Allows selecting and deselecting a filter of {@link BooleanFilter}.
 *
 * @internal
 */
export class BooleanFilterEntity implements FilterEntity {
  public static accepts = isBooleanFilter

  public constructor(protected store: Store<RootXStoreState>) {}

  deselect(filterParam: Filter): void {
    const filter = filterParam as BooleanFilter
    this.store.commit('x/facets/mutateFilter', { filter, newFilterState: { selected: false } })
    addFacetIfNotPresent(this.store, filter.facetId, 'BooleanFacet')
  }

  select(filterParam: Filter): void {
    const filter = filterParam as BooleanFilter
    this.store.commit('x/facets/mutateFilter', { filter, newFilterState: { selected: true } })
    addFacetIfNotPresent(this.store, filter.facetId, 'BooleanFacet')
  }
}
