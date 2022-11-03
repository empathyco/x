import { BooleanFilter, Facet, Filter } from '@empathyco/x-types';

/**
 * Facet model for the `platform` API.
 *
 * @public
 */
export interface PlatformFacet {
  facet: string;
  type: PlatformFacetType;
  values: PlatformFilter[];
}

/**
 * Facet type for the `platform` API. It can be: value, hierarchical or range.
 *
 * @public
 */
export type PlatformFacetType = 'value' | 'hierarchical' | 'range';

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

/**
 * Hierarchical Facet model used when combining search response mappers.
 *
 * @internal
 */
export interface AdapterHierarchicalFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'HierarchicalFacet';
  /** Filters available for the facet. */
  filters: AdapterHierarchicalFilter[];
}

/**
 * Hierarchical Filter model used when combining search response mappers.
 *
 * @internal
 */
export interface AdapterHierarchicalFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'HierarchicalFilter';
  /** A unique id used to reference the parent filter or null if it hasn't. */
  parentId: Filter['id'] | null;
  /** Descendants filters. */
  children?: AdapterHierarchicalFilter[];
}
