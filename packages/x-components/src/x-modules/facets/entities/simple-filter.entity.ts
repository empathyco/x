import { SimpleFilter, isSimpleFilter } from '@empathyco/x-types';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../store/store.types';
import { addFacetIfNotPresent } from './add-facet-if-not-present';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link SimpleFilter}.
 *
 * @internal
 */
export class SimpleFilterEntity implements FilterEntity {
  public static accepts = isSimpleFilter;

  public constructor(protected store: Store<RootXStoreState>) {}

  /**
   * Deselects and saves to the store the given filter.
   *
   * @param filter - The filter to deselect.
   */
  deselect(filter: SimpleFilter): void {
    this.store.commit('x/facets/mutateFilter', { filter, newFilterState: { selected: false } });
    addFacetIfNotPresent(this.store, filter.facetId, 'SimpleFacet');
  }

  /**
   * Selects and saves to the store the given filter.
   *
   * @param filter - The filter to select.
   */
  select(filter: SimpleFilter): void {
    this.store.commit('x/facets/mutateFilter', { filter, newFilterState: { selected: true } });
    addFacetIfNotPresent(this.store, filter.facetId, 'SimpleFacet');
  }
}
