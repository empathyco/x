import type { NamedModel } from './named-model.model'
import type { Previewable } from './previewable.model'

/**
 * A suggestion represents a query that has been proposed to the user, due of being popular,
 * matching with the current search query...
 *
 * @public
 */
export interface Suggestion extends NamedModel<'QuerySuggestion' | 'PopularSearch'>, Previewable {
  /** If it's a curated suggestion. */
  isCurated?: boolean
  /**
   * Unique identifier of the suggestion.
   *
   * @deprecated - The key field should be calculated if needed using the `query` and the
   * `facets` properties.
   */
  key: string
}
