import type { Filter } from './facet'
import type { NamedModel } from './named-model.model'
import type { Previewable } from './previewable.model'

/**
 * Represents a query that has been made by the user.
 *
 * @public
 */
export interface HistoryQuery extends Previewable, NamedModel<'HistoryQuery'> {
  /** Timestamp when the history query was created. */
  timestamp: number
  /** Filters selected for the query to search for. */
  selectedFilters?: Filter[]
}
