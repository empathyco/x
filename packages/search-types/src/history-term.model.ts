import { NamedModel } from './named-model.model';

export interface HistoryTerm extends NamedModel {
  term: string;
  timestamp: number;
}
