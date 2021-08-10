import { Facet, Filter } from '@empathyco/x-types-next';

/**
 * An object containing a list of facets, and the group they belong to.
 *
 * The facet group is used to perform operations over a list of facets. For example, some APIs
 * have dynamic facets. This means that depending on the selected filters, some facets can be
 * returned. For example if you select `category:television`, a new facet called *Screen size* might
 * appear. And, because now filters are stored in a dictionary instead of an array, and overridden
 * with each request, when the user performs a new query, we have to remove all the `Screen size`
 * filters because we don't know if the API will return them or not in the new query.
 */
export interface FacetGroup {
  /** The list of facets that belong to the group. */
  facets: Facet[];
  /** The group unique identifier. */
  id: string;
}

/**
 * Service to manipulate the filters.
 */
export interface FacetsService {
  /**
   * Compares if two lists contains the same filters.
   *
   * @param someFilters - A list of filters to compare.
   * @param anotherFilters - Another list of filters to compare.
   * @returns True if the two lists of filters are equal, which means that they have the same
   * filters. The position of the filter does not matter for this check.
   */
  areFiltersDifferent(someFilters: Filter[], anotherFilters: Filter[]): boolean;
  /**
   * Deselects the list of filters.
   *
   * @param facetIds - An optional list of facets ids from whom deselect the filters.
   */
  clearFilters(facetIds?: Array<Facet['id']>): void;
  /**
   * Deselects filter, adding it to the store if it was not present.
   *
   * @param filter - The filter to select.
   */
  deselect(filter: Filter): void;
  /**
   * Replaces the facets of the group with the new ones.
   *
   * @param facetGroup - An objet containing the id of the facets group, and the list of new facets
   * to store.
   */
  saveFacets(facetGroup: FacetGroup): void;
  /**
   * Selects filter, adding it to the store if it was not present.
   *
   * @param filter - The filter to select.
   */
  select(filter: Filter): void;
  /**
   * Selects a deselected filter, and deselects a selected filter, adding them to the store
   * in both cases.
   *
   * @param filter - The filter to toggle its selected state.
   */
  toggle(filter: Filter): void;
}
