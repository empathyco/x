import { FilterModel } from './facet/filter.model';

/**
 * @public
 * Common interface to ease the differentiate between different model types
 */
export interface NamedModel {
  readonly modelName: ModelNameType;
}

/**
 * @public
 * Type to ease the usage of the ModelNames interface with autocomplete suggestions
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
