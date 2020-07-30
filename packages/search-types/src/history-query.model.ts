import { NamedModel } from './named-model.model';
import { Previewable } from './previewable.model';

/**
 * @public
 * Represents a query that has been made by the user
 */
export interface HistoryQuery extends Previewable, NamedModel {
  timestamp: number;
}
