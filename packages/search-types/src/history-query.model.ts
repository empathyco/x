import { NamedModel } from './named-model.model';
import { Previewable } from './previewable.model';

/**
 * Represents a query that has been made by the user.
 *
 * @public
 */
export interface HistoryQuery extends Previewable, NamedModel<'HistoryQuery'> {
  /** Timestamp when the history query was created. */
  timestamp: number;
}
