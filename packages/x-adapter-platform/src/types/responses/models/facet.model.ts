/**
 * Facet model for the `platform` API.
 *
 * @public
 */
export interface PlatformFacet {
  facet: string;
  values: PlatformFilter[];
}

/**
 * Filter model for the `platform` API.
 *
 * @public
 */
export interface PlatformFilter {
  count: number;
  filter: string;
  id: string;
  value: string;
}

/**
 * HierarchicalFilter model for the `platform` API.
 *
 * @public
 */
export interface PlatformHierarchicalFilter extends PlatformFilter {
  children: PlatformFacet;
}
