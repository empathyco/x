import type { BooleanFilter, Facet, Filter } from '@empathyco/x-types'

/**
 * Facet model for the `platform` API.
 *
 * @public
 */
export interface PlatformFacet {
  label: string
  facet: string
  type: PlatformFacetType
  values: (PlatformFilter | PlatformSliderFilter)[]
}

/**
 * Facet type for the `platform` API. It can be: value, hierarchical or range.
 *
 * @public
 */
export type PlatformFacetType = 'value' | 'hierarchical' | 'range' | 'boolean' | 'slider'

/**
 * Filter model for the `platform` API.
 *
 * @public
 */
export interface PlatformFilter {
  count: number
  filter: string
  id: string
  value: string
}

/**
 * Slider filter model for the `platform` API, used when {@link PlatformFacetType} is `slider`.
 *
 * @public
 */
export interface PlatformSliderFilter {
  filter: string
  min: string
  max: string
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#style
  unit: 'decimal' | 'currency' | 'percent' | 'unit'
}

/**
 * HierarchicalFilter model for the `platform` API.
 *
 * @public
 */
export interface PlatformHierarchicalFilter extends PlatformFilter {
  children: PlatformFacet
}

/**
 * Hierarchical Facet model used when combining search response mappers.
 *
 * @internal
 */
export interface AdapterHierarchicalFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'HierarchicalFacet'
  /** Filters available for the facet. */
  filters: AdapterHierarchicalFilter[]
}

/**
 * Hierarchical Filter model used when combining search response mappers.
 *
 * @internal
 */
export interface AdapterHierarchicalFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'HierarchicalFilter'
  /** A unique id used to reference the parent filter or null if it hasn't. */
  parentId: Filter['id'] | null
  /** Descendants filters. */
  children?: AdapterHierarchicalFilter[]
}
