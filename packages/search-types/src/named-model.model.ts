import { FilterModel } from './facet/filter.model';

/**
 * Common interface to ease the differentiate between different model types.
 *
 * @public
 */
export interface NamedModel {
  /** The {@link ModelNameType | model name} value. */
  readonly modelName: ModelNameType;
}

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
  | FilterModel
  | string;
