import type { Filter, SimpleFilter } from '@empathyco/x-types'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../store/store.types'
import type { FilterEntity } from './types'
import { isSimpleFilter } from '@empathyco/x-types'
import { addFacetIfNotPresent } from './add-facet-if-not-present'

/**
 * Allows selecting and deselecting a filter of {@link SimpleFilter}.
 *
 * @internal
 */
export class SimpleFilterEntity implements FilterEntity {
  public static accepts = isSimpleFilter

  public constructor(protected store: Store<RootXStoreState>) {}

  /**
   * Deselects and saves to the store the given filter.
   *
   * @param filterParam - The filter to deselect.
   */
  deselect(filterParam: Filter): void {
    const filter = filterParam as SimpleFilter
    this.store.commit('x/facets/mutateFilter', { filter, newFilterState: { selected: false } })
    addFacetIfNotPresent(this.store, filter.facetId, 'SimpleFacet')
  }

  /**
   * Selects and saves to the store the given filter.
   *
   * @param filterParam - The filter to select.
   */
  select(filterParam: Filter): void {
    const filter = filterParam as SimpleFilter
    this.store.commit('x/facets/mutateFilter', { filter, newFilterState: { selected: true } })
    addFacetIfNotPresent(this.store, filter.facetId, 'SimpleFacet')
  }
}
