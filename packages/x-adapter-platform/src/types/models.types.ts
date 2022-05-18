import { PlatformFacet } from './responses/models/facet.model';
import { PlatformResult } from './responses/models/result.model';

export interface Contentable<T> {
  content: T[];
}

export interface PlatformCatalog extends Contentable<PlatformResult> {
  facets: PlatformFacet[];
  numFound: number;
  spellchecked: string;
  tagging: {
    query: string;
  };
}
