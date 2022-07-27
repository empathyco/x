import {
  EditableNumberRangeFilter,
  Facet,
  Filter,
  isEditableNumberRangeFilter
} from '@empathyco/x-types';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../store/store.types';
import { addFacetIfNotPresent } from './add-facet-if-not-present';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link @empathyco/x-types#EditableNumberRangeFilter
 * | EditableNumberRangeFilter}.
 *
 * @internal
 */
export class EditableNumberRangeFilterEntity implements FilterEntity {
  public constructor(protected store: Store<RootXStoreState>) {}

  static accepts(filter: Filter): boolean {
    return isEditableNumberRangeFilter(filter);
  }

  /**
   * It sets {@link @empathyco/x-types#EditableNumberRangeFilter | EditableNumberRangeFilter} to
   * false and reset the {@link @empathyco/x-types#EditableNumberRangeFilter
   * | EditableNumberRangeFilter} values to null.
   *
   * @param filter - The filter to deselect.
   */
  deselect(filter: EditableNumberRangeFilter): void {
    const newFilterState: Pick<EditableNumberRangeFilter, 'range' | 'facetId' | 'selected'> = {
      facetId: filter.facetId,
      range: { min: null, max: null },
      selected: false
    };
    this.removePreviousFilter(filter.facetId);
    this.store.commit('x/facets/mutateFilter', {
      filter,
      newFilterState: Object.assign(newFilterState, { id: this.getNewFilterId(newFilterState) })
    });
    addFacetIfNotPresent(this.store, filter.facetId, 'EditableNumberRangeFacet');
  }

  /**
   * It selects the {@link @empathyco/x-types#EditableNumberRangeFilter
   * | EditableNumberRangeFilter}.
   *
   * @param filter - The filter to select.
   * @remarks If the filter has no selected range, then filter is deselected when this
   * method is called.
   */
  select(filter: EditableNumberRangeFilter): void {
    const newFilterId = this.getNewFilterId(filter);
    this.removePreviousFilter(filter.facetId);
    this.store.commit('x/facets/mutateFilter', {
      filter,
      newFilterState: { id: newFilterId, selected: this.isSelected(filter) }
    });
    addFacetIfNotPresent(this.store, filter.facetId, 'EditableNumberRangeFacet');
  }

  /**
   * Generates a new filter id using the range values.
   *
   * @param filter - The filter to generate its new id.
   * @returns The new filter id.
   * @internal
   */
  protected getNewFilterId(filter: Pick<EditableNumberRangeFilter, 'range' | 'facetId'>): string {
    return `${filter.facetId}:${String(filter.range.min)}_${String(filter.range.max)}`;
  }

  /**
   * It returns if the filter range min or the filter range max is not null.
   *
   * @param filter - The filter to determine if it is selected or not.
   * @returns True if filter range min or filter range max is not null.
   * @internal
   */
  protected isSelected(filter: EditableNumberRangeFilter): boolean {
    return filter.range.min !== null || filter.range.max !== null;
  }

  /**
   * Removes the previous filter of this facet from the store, only if it exists.
   *
   * @param facetId - The facet to remove its only filter.
   * @internal
   */
  protected removePreviousFilter(facetId: Facet['id']): void {
    const previousFilter = this.getFilterByFacet(facetId);
    if (previousFilter) {
      this.store.commit('x/facets/removeFilter', previousFilter);
    }
  }

  /**
   * Retrieves the filter of the given facet id from the store.
   *
   * @param facetId -  The facet id to retrieve its filter.
   * @returns The filter of the facet if it exists.
   * @internal
   */
  protected getFilterByFacet(facetId: Facet['id']): EditableNumberRangeFilter | undefined {
    return this.store.getters['x/facets/facets'][facetId]?.filters?.[0];
  }
}
