import type { Facet, Filter, SliderFilter } from '@empathyco/x-types'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../store/store.types'
import type { FilterEntity } from './types'
import { isSliderFilter } from '@empathyco/x-types'
import { addFacetIfNotPresent } from './add-facet-if-not-present'

/**
 * Allows selecting and deselecting a filter of {@link @empathyco/x-types#SliderFilter
 * | SliderFilter}.
 *
 * @internal
 */
export class SliderFilterEntity implements FilterEntity {
  public constructor(protected store: Store<RootXStoreState>) {}

  static accepts(filter: Filter): boolean {
    return isSliderFilter(filter)
  }

  /**
   * It sets {@link @empathyco/x-types#SliderFilter | SliderFilter} to
   * false. Range values are kept to be able to update the {@link FacetsGetters.selectedFilters}
   * getter accordingly (as the id is built using the range).
   *
   * @param filterParam - The filter to deselect.
   */
  deselect(filterParam: Filter): void {
    const filter = filterParam as SliderFilter
    const newFilterState: Pick<SliderFilter, 'selectedRange' | 'range' | 'facetId' | 'selected'> = {
      facetId: filter.facetId,
      range: { min: filter.range.min, max: filter.range.max },
      selectedRange: { min: null, max: null },
      selected: false,
    }
    this.removePreviousFilter(filter.facetId)
    this.store.commit('x/facets/mutateFilter', {
      filter,
      newFilterState: Object.assign(newFilterState, { id: this.getNewFilterId(newFilterState) }),
    })
    addFacetIfNotPresent(this.store, filter.facetId, 'SliderFacet')
  }

  /**
   * It selects the {@link @empathyco/x-types#SliderFilter
   * | SliderFilter}.
   *
   * @param filterParam - The filter to select.
   * @remarks If the filter has no selected range, then filter is deselected when this
   * method is called.
   */
  select(filterParam: Filter): void {
    const filter = filterParam as SliderFilter
    this.removePreviousFilter(filter.facetId)
    this.store.commit('x/facets/mutateFilter', {
      filter,
      newFilterState: {
        id: this.getNewFilterId(filter),
        selected: this.isSelected(filter),
      },
    })
    addFacetIfNotPresent(this.store, filter.facetId, 'SliderFacet')
  }

  /**
   * Generates a new filter id using the range values.
   *
   * @param filter - The filter to generate its new id.
   * @returns The new filter id.
   * @internal
   */
  protected getNewFilterId({
    facetId,
    selectedRange,
    range,
  }: Pick<SliderFilter, 'selectedRange' | 'range' | 'facetId'>): string {
    return `${facetId}:${String(selectedRange.min ?? range.min)}-${String(selectedRange.max ?? range.max)}`
  }

  /**
   * It returns if the filter range min or the filter range max is not null.
   *
   * @param filter - The filter to determine if it is selected or not.
   * @returns True if filter selectedRange min or filter selectedRange max is diferrent from filter range
   * min or filter range max respectively.
   * @internal
   */
  protected isSelected({ selectedRange, range }: SliderFilter): boolean {
    return (
      (selectedRange.min ?? range.min) !== range.min ||
      (selectedRange.max ?? range.max) !== range.max
    )
  }

  /**
   * Removes the previous filter of this facet from the store, only if it exists.
   *
   * @param facetId - The facet to remove its only filter.
   * @internal
   */
  protected removePreviousFilter(facetId: Facet['id']): void {
    const previousFilter = this.getFilterByFacet(facetId)
    if (previousFilter) {
      this.store.commit('x/facets/removeFilter', previousFilter)
    }
  }

  /**
   * Retrieves the filter of the given facet id from the store.
   *
   * @param facetId -  The facet id to retrieve its filter.
   * @returns The filter of the facet if it exists.
   * @internal
   */
  protected getFilterByFacet(facetId: Facet['id']): SliderFilter | undefined {
    // eslint-disable-next-line ts/no-unsafe-member-access,ts/no-unsafe-return
    return this.store.getters['x/facets/facets'][facetId]?.filters?.[0]
  }
}
