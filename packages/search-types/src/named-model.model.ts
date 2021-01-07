/**
 * Type to ease the usage of the ModelNames interface with autocomplete suggestions.
 *
 * @public
 */
export type ModelNameType =
    'Result'
    | 'NextQueries'
    | 'NextQuery'
    | 'RelatedTag'
    | 'PopularSearch'
    | 'QuerySuggestion'
    | 'HistoryQuery'
    | FilterModelName
    | FacetModelName
    | string;

/**
 * Common interface to ease the differentiate between different model types.
 *
 * @public
 */
export interface NamedModel<T extends ModelNameType = ModelNameType> {
  /** The {@link ModelNameType | model name} value. */
  readonly modelName: T;
}

/**
 * Facets model names type. It can be: SimpleFacet, HierarchicalFacet or NumberRangeFacet.
 *
 * @public
 */
export type FacetModelName = 'SimpleFacet' | 'HierarchicalFacet' | 'NumberRangeFacet';

/**
 * Filters model names type. It can be: SimpleFilter, HierarchicalFilter or NumberRangeFilter.
 *
 * @public
 */
export type FilterModelName = 'SimpleFilter' | 'HierarchicalFilter' | 'NumberRangeFilter';
