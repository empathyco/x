import { Facet, Filter, HierarchicalFilter, SimpleFilter } from '@empathy/search-types';
import { XActionContext, XStoreModule } from '../../../store';
import { Dictionary } from '../../../utils';
import { FacetsConfig } from '../config.types';
import { MultiSelectChange } from '../events.types';

/**
 * Facets store state.
 *
 * @public
 */
export interface FacetsState {
  /** Configuration for the `Facets` module. */
  config: FacetsConfig;
  /** The facets in a dictionary shape, where the key is the `facet.id` property. */
  facets: Record<Facet['id'], Facet>;
}

/**
 * Object to wrap the payload needed for changing the selection state of a filter.
 *
 * @public
 */
export interface FilterSelectedChange {
  /** The filter to change its selection state. */
  filter: Filter;
  /** The new selected state. */
  selected: boolean;
}

/**
 * Facets store getters.
 *
 * @public
 */
export interface FacetsGetters {
  /**
   * Returns a dictionary which groups every filter, including the nested ones at the
   * same depth level.
   */
  flattenedFilters: Record<Filter['id'], Filter>;
  /**
   * Returns a single array which groups every selected filter, including the nested ones,
   * at the same depth level.
   */
  selectedFilters: Filter[];
}

/**
 * Facets store mutations.
 *
 * @public
 */
export interface FacetsMutations {
  /**
   * Sets the facets of the module.
   *
   * @param newFacets - Facets dictionary to be saved in the state.
   */
  setFacets(newFacets: Dictionary<Facet>): void;
  /**
   * Changes the multi-select option for a facet.
   *
   * @param multiSelectChange - The facet id to change its multi select configuration, and the new
   * multiSelect value.
   */
  setFacetMultiSelect(multiSelectChange: MultiSelectChange): void;
  /**
   * Changes the `selected` state of the filter.
   *
   * @param filterSelectChange - The filter and its new selected state.
   * @remarks The filter must exist in the facet's module state.
   * Otherwise the {@link FacetsGetters.selectedFilters} getter won't update with the new value.
   */
  setFilterSelected(filterSelectChange: FilterSelectedChange): void;
}

/**
 * Facets store actions.
 *
 * @public
 */
export interface FacetsActions {
  /**
   * Sets the facets of the module.
   *
   * @param newFacets - Facets array to be saved in the state.
   */
  setFacets(newFacets: Facet[]): void;
  /**
   * Deselects the filters of the provided facet id.
   *
   * @param facetId - Facet id from whom deselect all its filters.
   */
  clearFacetSelectedFilters(facetId: Facet['id']): void;
  /**
   * Deselects the filters of the provided facets ids.
   *
   * @param facetsIds - A list of facet ids from whom deselect all the filters.
   */
  clearFacetsSelectedFilters(facetsIds: Array<Facet['id']>): void;
  /**
   * Deselects all the filters.
   */
  clearSelectedFilters(): void;
  /**
   * Toggles the `selected` property of a simple filter.
   *
   * @param filter - The filter to toggle its `selected` property.
   */
  toggleSimpleFilter(filter: SimpleFilter): void;
  /**
   * Toggles the `selected` property of a hierarchical filter.
   *
   * @param filter - The filter to toggle its `selected` property.
   */
  toggleHierarchicalFilter(filter: HierarchicalFilter): void;
}

/**
 * The type of the context object for the facets module actions.
 *
 * @public
 */
export type FacetsActionsContext = XActionContext<
  FacetsState,
  FacetsGetters,
  FacetsMutations,
  FacetsActions
>;

/**
 * Facets type safe store module.
 *
 * @public
 */
export type FacetsXStoreModule = XStoreModule<
  FacetsState,
  FacetsGetters,
  FacetsMutations,
  FacetsActions
>;
