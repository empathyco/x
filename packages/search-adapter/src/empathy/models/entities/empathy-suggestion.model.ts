import { EmpathyFacet } from './empathy-facet.model';

export interface EmpathySuggestion {
  facets?: EmpathyFacet[];
  title: string;
  title_raw: string;
}
