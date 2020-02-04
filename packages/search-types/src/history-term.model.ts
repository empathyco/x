import { NamedModel } from './named-model.model';

/**
 * @public
 * A history term represents a query that has been made by the user
 */
export interface HistoryTerm extends NamedModel {
  term: string;
  timestamp: number;
}
