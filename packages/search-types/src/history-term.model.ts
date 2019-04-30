import { Facet } from './facet/facet.model';
import { NamedModel } from './named-model.model';

export interface HistoryTerm extends NamedModel {
  facet?: Facet;
  term: string;
  timestamp: number;
}
