import { EmpathyFacet } from './empathy-facet.model';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathySuggestion {
  facets?: EmpathyFacet[];
  title: string;
  title_raw: string;
}
