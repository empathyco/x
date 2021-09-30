import { Facet, Filter } from '@empathyco/x-types';
import { XActionContext, XStoreModule } from '../../../store';
import { Dictionary } from '../../../utils';
import { UrlParamValue } from '../../url';

/**
 * Facets store state.
 *
 * @public
 */
export interface FacetsState {
  /** Record of all available filters indexed by its id. */
  filters: Record<Filter['id'], Filter>;
  /** Record specifying the group each facet belongs to. */
  groups: Record<Facet['id'], GroupId>;
  /** The facets without their filters. */
  facets: Record<Facet['id'], Omit<Facet, 'filters'>>;
}

/**
 * Facets store getters.
 *
 * @public
 */
export interface FacetsGetters {
  /**
   * List of all selected filters.
   */
  selectedFilters: Filter[];
  /**
   * List of all selected filters grouped by their facet.
   */
  selectedFiltersByFacet: FiltersByFacet;
  /**
   * List of all facets with their filters.
   */
  facets: Record<Facet['id'], Facet>;
}

/**
 * Facets store mutations.
 *
 * @public
 */
export interface FacetsMutations {
  /**
   * Removes the filter from the {@link FacetsState.filters | filters} record.
   *
   * @param filter - The filter to remove.
   */
  removeFilter(filter: Filter): void;
  /**
   * Removes a list of filters from the {@link FacetsState.filters | filters} record.
   *
   * @param filters - The filters to remove.
   */
  removeFilters(filters: Filter[]): void;
  /**
   * Sets the group id of the facet.
   *
   * @param facetGroupEntry - An object containing the new groupId and the facetId of the facet to
   * update.
   */
  setFacetGroup(facetGroupEntry: FacetGroupEntry): void;
  /**
   * Adds a list of filters to the {@link FacetsState.filters | filters} record.
   *
   * @param filters - The filters to add.
   */
  setFilters(filters: Filter[]): void;
  /**
   * Adds the filter to the {@link FacetsState.filters | filters} record.
   *
   * @param filter - The filter to add.
   */
  setFilter(filter: Filter): void;
  /**
   * Removes the facet from the {@link FacetsState.facets | facets} record.
   *
   * @param facet - The facet to remove.
   */
  removeFacet(facet: Facet): void;
  /**
   * Adds the facet to the {@link FacetsState.facets | facets} record.
   *
   * @param facet - The facet to set in the store.
   */
  setFacet(facet: Facet): void;
}

/**
 * Facets store actions.
 *
 * @public
 */
export interface FacetsActions {
  /**
   * Receives a list of params from the url, builds the entities and
   * set them in the store.
   */
  setFiltersFromUrl(urlParams: Dictionary<UrlParamValue>): void;
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
 * Alias for GroupId.
 *
 * @public
 */
export type GroupId = string;

/**
 * An object containing a facet id and the group id it belongs to.
 *
 * @public
 */
export interface FacetGroupEntry {
  /** The facet id. */
  facetId: Facet['id'];
  /** The group id. */
  groupId: GroupId;
}

/**
 * Dictionary grouping filters by facet id.
 *
 * @public
 */
export type FiltersByFacet = Record<Facet['id'], Filter[]>;
