import { isFacetFilter, FacetFilter, Facet } from '@empathyco/x-types-next';
import { FacetsNextGetters } from '../store/types';
import { BaseFilterEntityModifier } from './types';

/**
 * Allows only to select only one filter from the same facet at the same time.
 */
export class SingleSelectModifier extends BaseFilterEntityModifier {
  /**
   * Selects the passed filter, and then deselects any other filter of the same facet.
   *
   * @param filter - The filter to select.
   */
  select(filter: FacetFilter): void {
    this.getOtherFilters(filter).forEach(siblingFilter => this.deselect(siblingFilter));
    this.entity.select(filter);
  }

  /**
   * Retrieves the rest of selected filters of the same facet than the one given.
   *
   * @param filter - The filter to find its relatives.
   * @returns A list of selected filters that belong to the same facet than the filter passed.
   * @internal
   */
  protected getOtherFilters(filter: FacetFilter): FacetFilter[] {
    /* This check seems dumb, but when you instantiate this modifier using the factory, the types
      `FacetFilter` parameter type is lost, so we should check it to avoid unexpected crashes
      due to a wrong configuration. When the logger is added we should add a warning here. */
    return isFacetFilter(filter)
      ? this.getFacetFilters(filter.facetId).filter(
          storeFilter => storeFilter.id !== filter.id && storeFilter.selected
        )
      : [];
  }

  /**
   * Retrieves All the filters from the given facet.
   *
   * @param facetId - The facet id to retrieve its filters.
   * @returns The filters from the given facet.
   * @internal
   */
  protected getFacetFilters(facetId: Facet['id']): FacetFilter[] {
    return (
      ((this.store.getters['x/facetsNext/filtersByFacet'] as FacetsNextGetters['filtersByFacet'])[
        facetId
      ] as FacetFilter[]) ?? []
    );
  }
}
