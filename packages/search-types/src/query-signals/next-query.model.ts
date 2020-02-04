import { Facet } from '../facet/facet.model';
import { NamedModel } from '../named-model.model';
import { Result } from '../result/result.model';

/**
 * @public
 * A next query is a suggestion of a new query that the user may be interested after searching for an specific term
 */
export interface NextQuery extends NamedModel {
  id: string;
  query: string;
  results: Result[];
  resultsFacets: Record<string, Facet>;
  numFound: number;
}
