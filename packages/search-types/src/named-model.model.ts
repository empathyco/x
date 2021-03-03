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
    | 'Banner'
    | 'Promoted'
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
 * Facets model names type. It can be: SimpleFacet, HierarchicalFacet, NumberRangeFacet or EditableNumberRangeFacet.
 *
 * @public
 */
export type FacetModelName = 'SimpleFacet' | 'HierarchicalFacet' | 'NumberRangeFacet' | 'EditableNumberRangeFacet';

/**
 * Filters model names type. It can be: {@link BooleanFilterModelName} or EditableNumberRangeFilter.
 *
 * @public
 */
export type FilterModelName = BooleanFilterModelName | 'EditableNumberRangeFilter';

/**
 * Boolean filters model names type. It can be: SimpleFilter, HierarchicalFilter, NumberRangeFilter.
 *
 * @public
 */
export type BooleanFilterModelName = 'SimpleFilter' | 'HierarchicalFilter' | 'NumberRangeFilter';
