import { Facet, Filter, isFacetFilter, isHierarchicalFacet } from '@empathyco/x-types';
import { Store } from 'vuex';
import { XPlugin } from '../../../plugins/index';
import { RootXStoreState } from '../../../store/index';
import { arrayToObject, groupItemsBy, isArrayEmpty } from '../../../utils/index';
import { FilterEntityFactory } from '../entities/filter-entity.factory';
import { FilterEntity } from '../entities/types';
import { FacetGroupEntry, FacetsGetters } from '../store/types';
import { flatHierarchicalFilters } from '../utils';
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
    const newFilters = this.updateStore(facetsGroup);
    /* Ensures that filters are selected with valid values. For example, you can't set a single
     select facet with 2 or more selected filters */
    this.updateFiltersSelectedState(newFilters);
  }

  updateFacets(facetsGroup: FacetsGroup): void {
    const selectedFilters = this.getSelectedFilters();
    const newFilters = this.updateStore(facetsGroup);
    this.updateFiltersSelectedState(newFilters, selectedFilters);
  }

  updatePreselectedFilters(filters: Filter[]): void {
    this.setPreselectedFilter(filters);
  }

  selectPreselectedFilters(): void {
    this.select(this.store.state.x.facets.preselectedFilters);
  }

  clearFilters(facetIds?: Array<Facet['id']>): void {
    this.getSelectedFilters()
      .filter(filter => !facetIds || (isFacetFilter(filter) && facetIds.includes(filter.facetId)))
      .forEach(this.deselect.bind(this));
  }

  deselect(filter: Filter): void {
    this.getFilterEntity(filter).deselect(filter);
  }

  select(filterOrFilters: Filter | Filter[]): void {
    const filters = Array.isArray(filterOrFilters) ? filterOrFilters : [filterOrFilters];
    filters.forEach(filter => this.getFilterEntity(filter).select(filter));
  }

  toggle(filter: Filter): void {
    if (filter.selected) {
      this.deselect(filter);
    } else {
      this.select(filter);
    }
  }

  /**
   * Sets the query.
   *
   * @param query - The query searched.
   * @internal
   */
  setQuery(query: string): void {
    this.store.commit('x/facets/setQuery', query);
  }

  /**
   * Creates an entity from a filter DTO.
   *
   * @param filter - The filter to create an entity from.
   * @returns The filter entity.
   * @internal
   */
  protected getFilterEntity(filter: Filter): FilterEntity {
    return this.filterEntityFactory.getFilterEntity(this.store, filter);
  }

  /**
   * Sets in the store the Facets, the Filters and the FacetsGroup, without applying any logic
   * to the selected state.
   *
   * @param facetsGroup - The {@link FacetsGroup} to set into the store state.
   * @returns An array with the new filters.
   * @internal
   */
  protected updateStore(facetsGroup: FacetsGroup): Filter[] {
    this.removeGroupFacets(facetsGroup.id);
    this.removeGroupFilters(facetsGroup.id);
    facetsGroup.facets.forEach(facet => {
      this.setFacetGroup({ facetId: facet.id, groupId: facetsGroup.id });
      this.setFacet(facet);
    });
    const newFilters = this.flatFilters(facetsGroup);
    this.setFilters(newFilters);
    return newFilters;
  }

  /**
   * This function returns the filters of the facets group flattened in an array. It keeps the
   * relations between the filters (parent--children).
   *
   * @privateRemarks If it is necessary to deal with more cases than the hierarchical, we need to
   * refactor this logic and maybe move it to the entities, to not make this service dependant of
   * the facet type. At the moment it is only one `if`, and is ok as long as no more `if`s are
   * needed.
   * @param facetsGroup - The facets group from where extract the filters to flat.
   * @returns An array with the filters flattened.
   * @internal
   */
  protected flatFilters(facetsGroup: FacetsGroup): Filter[] {
    return facetsGroup.facets.flatMap(facet =>
      isHierarchicalFacet(facet) ? flatHierarchicalFilters(facet.filters) : facet.filters
    );
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
   * @param newFilters - The list of filters to save.
   * @param previousFilters - (Optional) The list of old filters, used to set the `newFilters`
   * selected state.
   */
  protected updateFiltersSelectedState(newFilters: Filter[], previousFilters?: Filter[]): void {
    if (!isArrayEmpty(newFilters)) {
      const newStateFiltersMap = arrayToObject(previousFilters ?? newFilters, 'id');
      newFilters.forEach(filter => {
        const filterEntity = this.getFilterEntity(filter);
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
   *
   * @returns The removed filters.
   *
   * @internal
   */
  protected removeGroupFilters(groupId: FacetsGroup['id']): Filter[] {
    const filtersToRemove =
      groupItemsBy(Object.values(this.store.state.x.facets.filters), filter =>
        isFacetFilter(filter)
          ? this.store.state.x.facets.groups[filter.facetId]
          : '__unknown-group__'
      )[groupId] ?? [];
    this.removeFilters(filtersToRemove);
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
   * Saves a list of filters to the store without any state change logic applied.
   *
   * @param filters - The filters to save.
   * @internal
   */
  protected setFilters(filters: Filter[]): void {
    this.store.commit('x/facets/setFilters', filters);
  }

  /**
   * Saves a list of preselected filters to the store without any state change logic applied.
   *
   * @param filters - The filters to save.
   * @internal
   */
  protected setPreselectedFilter(filters: Filter[]): void {
    this.store.commit('x/facets/setPreselectedFilters', filters);
  }

  /**
   * Removes a list of filters from the store.
   *
   * @param filters - The filters to remove.
   * @internal
   */
  protected removeFilters(filters: Filter[]): void {
    this.store.commit('x/facets/removeFilters', filters);
  }
}
