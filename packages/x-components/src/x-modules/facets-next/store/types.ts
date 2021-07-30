import { Facet, Filter } from '@empathyco/x-types-next';
import { XActionContext, XStoreModule } from '../../../store';

/**
 * Facets store state.
 *
 * @public
 */
export interface FacetsNextState {
  /** Record of all available filters indexed by its id. */
  filters: Record<Filter['id'], Filter>;
  /** Record specifying the group each facet belongs to. */
  groups: Record<Facet['id'], GroupId>;
}

/**
 * Facets store getters.
 *
 * @public
 */
export interface FacetsNextGetters {
  /**
   * List of all selected filters.
   */
  selectedFilters: Filter[];
  /**
   * List of all filters grouped by their facet.
   */
  filtersByFacet: Record<Facet['id'], Filter>;
}

/**
 * Facets store mutations.
 *
 * @public
 */
export interface FacetsNextMutations {
  /**
   * Adds the filter to the {@link FacetsNextState.filters | filters} record.
   *
   * @param filter - The filter to add.
   */
  setFilter(filter: Filter): void;
  /**
   * Removes the filter from the {@link FacetsNextState.filters | filters} record.
   *
   * @param filter - The filter to remove.
   */
  removeFilter(filter: Filter): void;
  /**
   * Sets the group id of the facet.
   *
   * @param facetGroupEntry - An object containing the new groupId and the facetId of the facet to
   * update.
   */
  setFacetGroup(facetGroupEntry: FacetGroupEntry): void;
}

/**
 * Facets store actions.
 *
 * @public
 */
export interface FacetsNextActions {}

/**
 * The type of the context object for the facets module actions.
 *
 * @public
 */
export type FacetsNextActionsContext = XActionContext<
  FacetsNextState,
  FacetsNextGetters,
  FacetsNextMutations,
  FacetsNextActions
>;

/**
 * Facets type safe store module.
 *
 * @public
 */
export type FacetsNextXStoreModule = XStoreModule<
  FacetsNextState,
  FacetsNextGetters,
  FacetsNextMutations,
  FacetsNextActions
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
