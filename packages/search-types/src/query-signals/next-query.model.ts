import { Facet } from '../facet/facet.model';
import { NamedModel } from '../named-model.model';
import { Result } from '../result/result.model';

export interface NextQuery extends NamedModel {
  id: string;
  query: string;
  results: Result[];
  resultsFacets: Record<string, Facet>;
  numFound: number;
}
