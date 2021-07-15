import {
  Facet,
  Filter,
  HierarchicalFilter,
  SimpleFilter,
  NumberRangeFilter,
  BooleanFilter,
  EditableNumberRangeFilter,
  RangeValue
} from '@empathyco/x-types';
import { XActionContext, XStoreModule } from '../../../store';
import { Dictionary } from '../../../utils';
import { FacetsConfig } from '../config.types';

/**
 * Facets store state.
 *
 * @public
 */
export interface FacetsState {
  /** Configuration for the `Facets` module. */
  config: FacetsConfig;
  /** The backend facets in a dictionary shape, where the key is the `facet.id` property. */
  backendFacets: Record<Facet['id'], Facet>;
  /**
   * The frontend facets in a dictionary shape, where the key is the `facet.id` property. This
   * facets are set manually in the state and they're not expected to be in the API response.
   */
  frontendFacets: Record<Facet['id'], Facet>;
  /** The current query {@link FacetsState.query}. */
  query: string;
}

/**
 * Facets store getters.
 *
 * @public
 */
export interface FacetsGetters {
  /**
   * Returns a dictionary of facets grouping {@link FacetsState.backendFacets} and
   * {@link FacetsState.frontendFacets}, where they key is the `facet.id property`.
   */
  facets: Record<Facet['id'], Facet>;
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
  /**
   * Returns a dictionary which groups the selected filters by its facet id.
   */
  selectedFiltersByFacet: FiltersByFacet;
}

/**
 * Facets store mutations.
 *
 * @public
 */
export interface FacetsMutations {
  /**
   * Sets the backend facets of the module.
   *
   * @param newFacets - Facets dictionary to be saved in the state.
   */
  setBackendFacets(newFacets: Dictionary<Facet>): void;
  /**
   * Sets the frontend facets of the module.
   *
   * @param newFacets - Facets dictionary to be saved in the state.
   */
  setFrontendFacets(newFacets: Dictionary<Facet>): void;
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
  /**
   * Sets the {@link FacetsState.query} property.
   *
   * @param query - The new {@link FacetsState.query}.
   */
  setQuery(query: string): void;
  /**
   * Sets the `range` property of an editable number range filter.
   *
   * @param payload - An {@link EditableNumberRangeFilterChange | object}.
   */
  setEditableNumberRangeFilterRange(payload: EditableNumberRangeFilterChange): void;
}

/**
 * Facets store actions.
 *
 * @public
 */
export interface FacetsActions {
  /**
   * Sets the backend facets of the module. This action keeps the `newFacets` filters selected
   * state.
   *
   * @param newFacets - Facets array to be saved in the state.
   */
  setBackendFacets(newFacets: Facet[]): void;
  /**
   * Updates the backend facets of the module. This action ignores the `newFacets` filters selected
   * state, and uses the old selected filters instead.
   *
   * @param newFacets - Facets array to be saved in the state.
   */
  updateBackendFacets(newFacets: Facet[]): void;
  /**
   * Sets the frontend facets of the module.
   *
   * @param newFacets - Facets array to be saved in the state.
   */
  setFrontendFacets(newFacets: Facet[]): void;
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
   * Toggles the `selected` property of a number range filter.
   *
   * @param filter - The filter to toggle its `selected` property.
   */
  toggleNumberRangeFilter(filter: NumberRangeFilter): void;
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

/**
 * Dictionary grouping filters by facet id.
 *
 * @public
 */
export type FiltersByFacet = Record<Facet['id'], Filter[]>;

/**
 * Object to wrap the payload needed for changing the selection state of a filter.
 *
 * @public
 */
export interface FilterSelectedChange {
  /** The filter to change its selection state. */
  filter: BooleanFilter;
  /** The new selected state. */
  selected: boolean;
}

/**
 * Payload for the {@link FacetsXEvents.FacetMultiSelectChanged} event.
 *
 * @public
 */
export interface MultiSelectChange {
  /** The facet unique identifier. */
  facetId: Facet['id'];
  /** The facet multiSelect new value. */
  multiSelect: boolean;
}

/**
 * Payload for the {@link FacetsXEvents.UserModifiedEditableNumberRangeFilter} event.
 *
 * @public
 */
export interface EditableNumberRangeFilterChange {
  /** The editable number range filter to be modified. */
  filter: EditableNumberRangeFilter;
  /** The new range. */
  range: RangeValue;
}
