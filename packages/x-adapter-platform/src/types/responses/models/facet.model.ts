/**
 * Facet model for the `platform` API.
 *
 * @public
 */
import { Filter, Facet, BooleanFilter } from '@empathyco/x-types';

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

/**
 * Hierarchical Facet model used when combining search response mappers.
 */
export interface AdapterHierarchicalFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'HierarchicalFacet';
  /** Filters available for the facet. */
  filters: AdapterHierarchicalFilter[];
}

/**
 * Hierarchical Filter model used when combining search response mappers.
 */
export interface AdapterHierarchicalFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'HierarchicalFilter';
  /** A unique id used to reference the parent filter or null if it hasn't. */
  parentId: Filter['id'] | null;
  /** Descendants filters id. */
  children?: AdapterHierarchicalFacet;
}
