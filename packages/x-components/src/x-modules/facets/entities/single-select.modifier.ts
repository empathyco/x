import {
  isFacetFilter,
  isHierarchicalFilter,
  FacetFilter,
  Facet,
  Filter,
  HierarchicalFilter
} from '@empathyco/x-types';
import { BaseFilterEntityModifier } from './types';

/**
 * Allows only to select only one filter from the same facet at the same time.
 *
 * @internal
 */
export class SingleSelectModifier extends BaseFilterEntityModifier {
  /**
   * Selects the passed filter, and then deselects any other filter of the same facet.
   *
   * @param filter - The filter to select.
   */
  select(filter: FacetFilter): void {
    this.getOtherFilters(filter).forEach(this.deselect.bind(this));
    this.entity.select(filter);
  }

  /**
   * Retrieves the rest of selected filters of the same facet than the one given.
   *
   * @param filter - The filter to find its relatives.
   * @returns A list of selected filters that belong to the same facet than the filter passed.
   * @remarks It takes into account if the passed filter is an
   * {@link @empathyco/x-types#HierarchicalFilter | HierarchicalFilter} to exclude the ancestors and
   * descendants.
   *
   * @internal
   */
  protected getOtherFilters(filter: FacetFilter): FacetFilter[] {
    /* This check seems dumb, but when you instantiate this modifier using the factory, the types
      `FacetFilter` parameter type is lost, so we should check it to avoid unexpected crashes
      due to a wrong configuration. */
    if (isHierarchicalFilter(filter)) {
      const ancestorsIds = this.getAncestorsIds(filter);
      const descendantsIds = this.getDescendantsIds(filter);
      return this.getFacetFilters(filter.facetId).filter(
        storeFilter =>
          !ancestorsIds.includes(storeFilter.id) && !descendantsIds.includes(storeFilter.id)
      );
    } else if (isFacetFilter(filter)) {
      return this.getFacetFilters(filter.facetId).filter(
        storeFilter => storeFilter.id !== filter.id && storeFilter.selected
      );
    } else {
      // TODO Add a warning in case a non facet filter is passed here.
      return [];
    }
  }

  /**
   * Returns the ancestors Filters Ids of the passed filter.
   *
   * @param filter - The {@link @empathyco/x-types#Filter | Filter} which obtain the ancestors from.
   * @param ids - (Optional) an Array with the Ids used to execute the method recursively.
   * @returns An Array with the ancestors ids.
   * @internal
   */
  protected getAncestorsIds(
    filter: HierarchicalFilter,
    ids: Array<Filter['id']> = [filter.id]
  ): Array<Filter['id']> {
    return filter?.parentId
      ? this.getAncestorsIds(
          this.store.state.x.facets.filters[filter.parentId] as HierarchicalFilter,
          [filter.parentId, ...ids]
        )
      : ids;
  }

  /**
   * Returns the descendants Filters Ids of the passed filter.
   *
   * @param filter - The {@link @empathyco/x-types#Filter | Filter} which obtain the descendants
   * from.
   * @param ids - (Optional) an Array with the Ids used to execute the method recursively.
   * @returns An Array with the descendants ids.
   * @internal
   */
  protected getDescendantsIds(
    filter: HierarchicalFilter,
    ids: Array<Filter['id']> = [filter.id]
  ): Array<Filter['id']> {
    return filter?.children?.length
      ? filter?.children.reduce(
          (descendantIdsList, descendant) =>
            this.getDescendantsIds(descendant, [descendant.id, ...descendantIdsList]),
          ids
        )
      : ids;
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
      ((this.store.getters['x/facets/facets'] as Record<Facet['id'], Facet>)[facetId]
        ?.filters as FacetFilter[]) ?? []
    );
  }
}
