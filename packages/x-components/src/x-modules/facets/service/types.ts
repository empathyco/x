import { Facet, Filter } from '@empathyco/x-types';

/**
 * An object containing a list of facets, and the group they belong to.
 *
 * The facet group is used to perform operations over a list of facets. For example, some APIs
 * have dynamic facets. This means that depending on the selected filters, some facets can be
 * returned. For example if you select `category:television`, a new facet called *Screen size* might
 * appear. And, because now filters are stored in a dictionary instead of an array, and overridden
 * with each request, when the user performs a new query, we have to remove all the `Screen size`
 * filters because we don't know if the API will return them or not in the new query.
 *
 * @public
 */
export interface FacetsGroup {
  /** The list of facets that belong to the group. */
  facets: Facet[];
  /** The group unique identifier. */
  id: string;
}

/**
 * An object containing additional context regarding the filters.
 *
 * @public
 */
export interface FiltersMetadata {
  /** Flag to prevent the clearing of sticky filters. */
  keepSticky?: boolean;
}

/**
 * Service to manipulate the filters.
 *
 * @public
 */
export interface FacetsService {
  /**
   * Deselects the selected filters.
   *
   * @param facetIds - An optional list of facets ids from whom deselect the filters.
   * @param metadata - An optional object with the event metadata.
   */
  clearFilters(facetIds?: Array<Facet['id']>, metadata?: FiltersMetadata): void;

  /**
   * Deselects the selected filters. This is intended to be used from the wiring where currently
   * we can only provide one argument.
   *
   * @param payload - The event payload that can contain the list of facets ids from whom deselect
   * the filters and the event metadata.
   */
  clearFiltersWithMetadata(payload?: {
    facetIds?: Array<Facet['id']>;
    metadata?: FiltersMetadata;
  }): void;
  /**
   * Deselects filter, adding it to the store if it was not present.
   *
   * @param filter - The filter to deselect.
   * @param metadata - An optional object with the event metadata.
   */
  deselect(filter: Filter, metadata?: FiltersMetadata): void;
  /**
   * Replaces the facets of the group with the new ones. It ignores the provided filters selected
   * state, replacing it with the previous selected filter.
   *
   * @param facetsGroup - An object containing the id of the facets group, and the list of new
   * facets to store.
   */
  updateFacets(facetsGroup: FacetsGroup): void;
  /**
   * Selects preselected filter/filters, adding it/them to the store if it/they are not present.
   *
   */
  selectPreselectedFilters(): void;
  /**
   * Replaces the preselected filters with the new ones.
   *
   * @param filters - An array of filters.
   */
  updatePreselectedFilters(filters: Filter[]): void;
  /**
   * Sets the facets of the group. This method just replaces the facets, and keeps the given facet's
   * filters selected state as it is.
   *
   * @param facetsGroup - An object containing the id of the facets group, and the list of new
   * facets to store.
   */
  setFacets(facetsGroup: FacetsGroup): void;
  /**
   * Selects filter/filters, adding it/them to the store if it/they was not present.
   *
   * @param filter - The filter/filters to select.
   */
  select(filter: Filter | Filter[]): void;
  /**
   * Sets the query.
   *
   * @param query - The query searched.
   */
  setQuery(query: string): void;
  /**
   * Selects a deselected filter, and deselects a selected filter, adding them to the store
   * in both cases.
   *
   * @param filter - The filter to toggle.
   */
  toggle(filter: Filter): void;
}
