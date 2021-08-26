import { Store } from 'vuex';
import { isNumberRangeFilter, NumberRangeFilter } from '@empathyco/x-types';
import { RootXStoreState } from '../../../store/store.types';
import { addFacetIfNotPresent } from './add-facet-if-not-present';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link NumberRangeFilter}.
 */
export class NumberRangeFilterEntity implements FilterEntity {
  public static accepts = isNumberRangeFilter;

  public constructor(protected store: Store<RootXStoreState>) {}

  /**
   * Deselects and saves to the store the given filter.
   *
   * @param filter - The filter to deselect.
   */
  deselect(filter: NumberRangeFilter): void {
    this.store.commit('x/facets/setFilter', { ...filter, selected: false });
    addFacetIfNotPresent(this.store, filter.facetId, 'NumberRangeFacet');
  }

  /**
   * Selects and saves to the store the given filter.
   *
   * @param filter - The filter to select.
   */
  select(filter: NumberRangeFilter): void {
    this.store.commit('x/facets/setFilter', { ...filter, selected: true });
    addFacetIfNotPresent(this.store, filter.facetId, 'NumberRangeFacet');
  }
}
