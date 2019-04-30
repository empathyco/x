import { Facet } from './facet/facet.model';
import { NamedModel } from './named-model.model';

export interface Suggestion extends NamedModel {
  facets?: Facet[];
  html: string;
  term: string;
  key: string;
}
