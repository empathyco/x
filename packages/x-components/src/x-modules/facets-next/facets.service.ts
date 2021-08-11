import { Facet, Filter, isFacetFilter } from '@empathyco/x-types-next';
import { Store } from 'vuex';
import { XPlugin } from '../../plugins';
import { RootXStoreState } from '../../store';
import { arrayToObject, groupItemsBy } from '../../utils';
import { FilterEntityFactory } from './entities/filter-entity.factory';
import { FilterEntity } from './entities/types';
import { FacetGroup, FacetsService } from './facets-service.types';
import { FacetGroupEntry, FacetsNextGetters } from './store';

/**
 * Default implementation for the {@link FacetsService}.
 *
 * @public
 */
export class BaseFacetsService implements FacetsService {
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

  saveFacets(facetGroup: FacetGroup): void {
    const previousFilters = this.removeGroupFilters(facetGroup.id);
    facetGroup.facets.forEach(facet => {
      this.setFacetGroup({
        facetId: facet.id,
        groupId: facetGroup.id
      });
      this.saveFilters(facet.filters, previousFilters);
    });
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
   * Removes a filter from the store.
   *
   * @param filter - The filter to remove.
   * @internal
   */
  protected removeFilter(filter: Filter): void {
    this.store.commit('x/facetsNext/removeFilter', filter);
  }

  /**
   * Removes the filters that belong to the given group.
   *
   * @param groupId - The id of the group from whom remove the filters.
   * @returns The removed filters.
   * @internal
   */
  protected removeGroupFilters(groupId: FacetGroup['id']): Filter[] {
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
   * Saves the list of filters to the store, changing its selection state to match the store
   * filters one.
   *
   * @param newFilters - The list of filters to save. They should belong to the same facet, or have
   * no facet.
   * @param previousFilters - The list of old filters, used to set the `newFilters`
   * selected state.
   */
  protected saveFilters(newFilters: Filter[], previousFilters: Filter[]): void {
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
}
