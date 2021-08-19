import { Facet, Filter, isFacetFilter } from '@empathyco/x-types-next';
import { Store } from 'vuex';
import { XPlugin } from '../../../plugins/index';
import { RootXStoreState } from '../../../store/index';
import { arrayToObject, groupItemsBy } from '../../../utils/index';
import { FilterEntityFactory } from '../entities/filter-entity.factory';
import { FilterEntity } from '../entities/types';
import { FacetGroupEntry, FacetsNextGetters } from '../store/types';
import { FacetsGroup, FacetsService } from './types';

/**
 * Default implementation for the {@link FacetsService}.
 *
 * @public
 */
export class DefaultFacetsService implements FacetsService {
  /**
   * Global instance of the {@link FacetsService}.
   */
  public static instance: FacetsService = new DefaultFacetsService() as FacetsService;

  protected get store(): Store<RootXStoreState> {
    return XPlugin.store;
  }

  areFiltersDifferent(someFilters: Filter[], anotherFilters: Filter[]): boolean {
    return (
      someFilters.length !== anotherFilters.length ||
      someFilters.some(filter => !anotherFilters.find(otherFilter => otherFilter.id === filter.id))
    );
  }

  clearFilters(facetIds?: Array<Facet['id']>): void {
    this.getSelectedFilters()
      .filter(filter => !facetIds || (isFacetFilter(filter) && facetIds.includes(filter.facetId)))
      .forEach(this.deselect.bind(this));
  }

  deselect(filter: Filter): void {
    this.createEntity(filter).deselect(filter);
  }

  updateFacets(facetsGroup: FacetsGroup): void {
    this.removeGroupFacets(facetsGroup.id);
    const previousFilters = this.removeGroupFilters(facetsGroup.id);
    facetsGroup.facets.forEach(facet => {
      this.setFacetGroup({
        facetId: facet.id,
        groupId: facetsGroup.id
      });
      this.saveFiltersWithPreviousState(facet.filters, previousFilters);
    });
    facetsGroup.facets.forEach(facet => this.setFacet(facet));
  }

  setFacets(facetsGroup: FacetsGroup): void {
    this.removeGroupFacets(facetsGroup.id);
    this.removeGroupFilters(facetsGroup.id);
    facetsGroup.facets.forEach(facet => {
      this.setFacetGroup({
        facetId: facet.id,
        groupId: facetsGroup.id
      });
      facet.filters.forEach(filter => {
        if (filter.selected) {
          this.select(filter);
        } else {
          this.deselect(filter);
        }
      });
    });
    facetsGroup.facets.forEach(facet => this.setFacet(facet));
  }

  select(filter: Filter): void {
    this.createEntity(filter).select(filter);
  }

  toggle(filter: Filter): void {
    if (filter.selected) {
      this.deselect(filter);
    } else {
      this.select(filter);
    }
  }

  /**
   * Creates an entity from a filter DTO.
   *
   * @param filter - The filter to create an entity from.
   * @returns The filter entity.
   * @internal
   */
  protected createEntity(filter: Filter): FilterEntity {
    return FilterEntityFactory.instance.createFilterEntity(this.store, filter);
  }

  /**
   * Retrieves the selected filters from the store.
   *
   * @returns The list of selected filters of the store.
   * @internal
   */
  protected getSelectedFilters(): FacetsNextGetters['selectedFilters'] {
    return this.store.getters['x/facetsNext/selectedFilters'];
  }

  /**
   * Removes the filters that belong to the given group.
   *
   * @param groupId - The id of the group from whom remove the filters that are in the store.
   * @returns The removed filters.
   * @internal
   */
  protected removeGroupFilters(groupId: FacetsGroup['id']): Filter[] {
    const filtersToRemove =
      groupItemsBy(Object.values(this.store.state.x.facetsNext.filters), filter =>
        isFacetFilter(filter)
          ? this.store.state.x.facetsNext.groups[filter.facetId]
          : '__unknown-group__'
      )[groupId] ?? [];
    filtersToRemove.forEach(this.removeFilter.bind(this));
    return filtersToRemove;
  }

  /**
   * Removes a filter from the store.
   *
   * @param filter - The filter to remove.
   * @internal
   */
  protected removeFilter(filter: Filter): void {
    this.store.commit('x/facetsNext/removeFilter', filter);
  }

  /**
   * Saves the list of filters to the store, changing its selection state to match the store
   * filters one.
   *
   * @param newFilters - The list of filters to save. They should belong to the same facet, or have
   * no facet.
   * @param previousFilters - The list of old filters, used to set the `newFilters`
   * selected state.
   */
  protected saveFiltersWithPreviousState(newFilters: Filter[], previousFilters: Filter[]): void {
    const filterEntity = FilterEntityFactory.instance.createFilterEntity(this.store, newFilters[0]);
    const previousFiltersMap = arrayToObject(previousFilters, 'id');
    newFilters.forEach(filter => {
      if (previousFiltersMap[filter.id]?.selected) {
        filterEntity.select(filter);
      } else {
        filterEntity.deselect(filter);
      }
    });
  }

  /**
   * Sets the group that a facet belongs to.
   *
   * @param facetGroup - The id of the facet, and the group it belongs to.
   * @internal
   */
  protected setFacetGroup(facetGroup: FacetGroupEntry): void {
    this.store.commit('x/facetsNext/setFacetGroup', facetGroup);
  }

  /**
   * Removes the facets that belong to the given group.
   *
   * @param groupId - The id of the group from whom remove the facets that are in the store.
   * @returns The removed facets.
   * @internal
   */
  protected removeGroupFacets(groupId: FacetsGroup['id']): Omit<Facet, 'filters'>[] {
    const facetsToRemove = Object.values(this.store.state.x.facetsNext.facets).filter(
      facet => facet.id === groupId
    );
    facetsToRemove.forEach(facet => this.store.commit('x/facetsNext/removeFacet', facet));
    return facetsToRemove;
  }

  /**
   * Sets the Facet to the store facets record.
   *
   * @param facet - The facet to store.
   *
   * @internal
   */
  protected setFacet({ filters, ...restFacet }: Facet): void {
    this.store.commit('x/facetsNext/setFacet', restFacet);
  }
}
