import { Facet, Filter, isFacetFilter } from '@empathyco/x-types';
import { Store } from 'vuex';
import { XPlugin } from '../../../plugins/index';
import { RootXStoreState } from '../../../store/index';
import { arrayToObject, groupItemsBy, isArrayEmpty } from '../../../utils/index';
import { FilterEntityFactory } from '../entities/filter-entity.factory';
import { FilterEntity } from '../entities/types';
import { FacetGroupEntry, FacetsGetters } from '../store/types';
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
  public static instance: FacetsService = new DefaultFacetsService();

  public constructor(
    protected filterEntityFactory: FilterEntityFactory = FilterEntityFactory.instance
  ) {}

  /**
   * The {@link https://vuex.vuejs.org/ | Vuex} store to use in the service.
   *
   * @returns The store.
   * @internal
   */
  protected get store(): Store<RootXStoreState> {
    return XPlugin.store;
  }

  setFacets(facetsGroup: FacetsGroup): void {
    const { newFilters } = this.updateStore(facetsGroup);
    this.updateFiltersSelectedState(newFilters);
  }

  updateFacets(facetsGroup: FacetsGroup): void {
    const { newFilters, previousFilters } = this.updateStore(facetsGroup);
    this.updateFiltersSelectedState(newFilters, previousFilters);
  }

  clearFilters(facetIds?: Array<Facet['id']>): void {
    this.getSelectedFilters()
      .filter(filter => !facetIds || (isFacetFilter(filter) && facetIds.includes(filter.facetId)))
      .forEach(this.deselect.bind(this));
  }

  deselect(filter: Filter): void {
    this.createEntity(filter).deselect(filter);
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
    return this.filterEntityFactory.createFilterEntity(this.store, filter);
  }

  /**
   * Sets in the store the Facets, the Filters and the FacetsGroup, without applying any logic
   * to the selected state.
   *
   * @param facetsGroup - The {@link FacetsGroup} to set into the store state.
   * @returns Object with the `previousFilters` removed from store state and the `newFilters` to
   * set into the store state.
   * @internal
   */
  protected updateStore(facetsGroup: FacetsGroup): {
    previousFilters: Filter[];
    newFilters: Filter[];
  } {
    this.removeGroupFacets(facetsGroup.id);
    const previousFilters = this.removeGroupFilters(facetsGroup.id);
    facetsGroup.facets.forEach(facet => {
      this.setFacetGroup({ facetId: facet.id, groupId: facetsGroup.id });
      this.setFacet(facet);
    });
    const newFilters = facetsGroup.facets.flatMap(facet => facet.filters);
    newFilters.forEach(this.setFilter.bind(this));
    return { newFilters, previousFilters };
  }

  /**
   * Retrieves the selected filters from the store.
   *
   * @returns The list of selected filters of the store.
   * @internal
   */
  protected getSelectedFilters(): FacetsGetters['selectedFilters'] {
    return this.store.getters['x/facets/selectedFilters'];
  }

  /**
   * Changes the filters selection state to match the store.
   *
   * @param newFilters - The list of filters to save. They should belong to the same facet, or have
   * no facet.
   * @param previousFilters - (Optional) The list of old filters, used to set the `newFilters`
   * selected state.
   */
  protected updateFiltersSelectedState(newFilters: Filter[], previousFilters?: Filter[]): void {
    if (!isArrayEmpty(newFilters)) {
      const filterEntity = this.createEntity(newFilters[0]);
      const newStateFiltersMap = arrayToObject(previousFilters ?? newFilters, 'id');
      newFilters.forEach(filter => {
        if (newStateFiltersMap[filter.id]?.selected) {
          filterEntity.select(filter);
        } else {
          filterEntity.deselect(filter);
        }
      });
    }
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
      groupItemsBy(Object.values(this.store.state.x.facets.filters), filter =>
        isFacetFilter(filter)
          ? this.store.state.x.facets.groups[filter.facetId]
          : '__unknown-group__'
      )[groupId] ?? [];
    filtersToRemove.forEach(this.removeFilter.bind(this));
    return filtersToRemove;
  }

  /**
   * Removes the facets that belong to the given group.
   *
   * @param groupId - The id of the group from whom remove the facets that are in the store.
   * @returns The removed facets.
   * @internal
   */
  protected removeGroupFacets(groupId: FacetsGroup['id']): Omit<Facet, 'filters'>[] {
    const facetsToRemove = Object.values(this.store.state.x.facets.facets).filter(
      facet => this.store.state.x.facets.groups[facet.id] === groupId
    );
    facetsToRemove.forEach(this.removeFacet.bind(this));
    return facetsToRemove;
  }

  /**
   * Sets the group that a facet belongs to.
   *
   * @param facetGroup - The id of the facet, and the group it belongs to.
   * @internal
   */
  protected setFacetGroup(facetGroup: FacetGroupEntry): void {
    this.store.commit('x/facets/setFacetGroup', facetGroup);
  }

  /**
   * Sets the Facet to the store facets record.
   *
   * @param facet - The facet to store.
   *
   * @internal
   */
  protected setFacet({ filters, ...restFacet }: Facet): void {
    this.store.commit('x/facets/setFacet', restFacet);
  }

  /**
   * Removes a facet from the store.
   *
   * @param facet - The facet to remove.
   * @internal
   */
  protected removeFacet(facet: Omit<Facet, 'filters'>): void {
    this.store.commit('x/facets/removeFacet', facet);
  }

  /**
   * Saves a filter to the store without any state change logic applied.
   *
   * @param filter - The filter to save.
   * @internal
   */
  protected setFilter(filter: Filter): void {
    this.store.commit('x/facets/setFilter', filter);
  }

  /**
   * Removes a filter from the store.
   *
   * @param filter - The filter to remove.
   * @internal
   */
  protected removeFilter(filter: Filter): void {
    this.store.commit('x/facets/removeFilter', filter);
  }
}
