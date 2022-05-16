/**
 * Type to ease the usage of the ModelNames interface with autocomplete suggestions.
 *
 * @public
 */
export type ModelNameType =
  | 'Result'
  | 'NextQueries'
  | 'NextQuery'
  | 'RelatedTag'
  | 'PopularSearch'
  | 'QuerySuggestion'
  | 'HistoryQuery'
  | 'Banner'
  | 'Promoted'
  | 'Redirection'
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
 * Facets model names type. It can be: SimpleFacet, HierarchicalFacet, NumberRangeFacet
 * or EditableNumberRangeFacet.
 *
 * @public
 */
export type FacetModelName =
  | 'SimpleFacet'
  | 'HierarchicalFacet'
  | 'NumberRangeFacet'
  | 'EditableNumberRangeFacet';

/**
 * Filters model names type. It can be: {@link BooleanFilterModelName}, RawFilter
 * or EditableNumberRangeFilter.
 *
 * @public
 */
export type FilterModelName = BooleanFilterModelName | 'EditableNumberRangeFilter' | 'RawFilter';

/**
 * Const to use in the {@link BooleanFilterModelName} Type definition and also in Type Guards.
 *
 * @public
 */
export const BooleanFilterModelNames = [
  'SimpleFilter',
  'HierarchicalFilter',
  'NumberRangeFilter'
] as const;

/**
 * Type to ease the usage of a model name in a {@link BooleanFilter} with autocomplete suggestions.
 *
 * @public
 */
export type BooleanFilterModelName = typeof BooleanFilterModelNames[number];
