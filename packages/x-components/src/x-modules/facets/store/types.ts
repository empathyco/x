import { Facet, Filter } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
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
  facets: Dictionary<Facet>;
}

/**
 * Facets store getters.
 *
 * @public
 */
export interface FacetsGetters {
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
   * @param newFacets - Facets array to be saved in the state.
   */
  setFacets(newFacets: Facet[]): void;
}

/**
 * Facets store actions.
 *
 * @public
 */
export interface FacetsActions {}

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
