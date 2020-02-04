import { Facet } from './facet/facet.model';
import { NamedModel } from './named-model.model';

/**
 * @public
 * A suggestion represents a query that has been proposed to the user, due of being popular, matching with the current search query...
 */
export interface Suggestion extends NamedModel {
  facets: Facet[];
  /** @deprecated The HTML should be calculated in the components that use this model */
  html: string;
  term: string;
  key: string;
}
