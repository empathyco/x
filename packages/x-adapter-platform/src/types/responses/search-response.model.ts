import { PlatformResult } from '../models/result.model';
import { PlatformBanner } from '../models/banner.model';
import { PlatformFacet } from '../models/facet.model';
import { PlatformPromoted } from '../models/promoted.model';
import { PlatformRedirection } from '../models/redirection.model';
import { PlatformPartialResult } from '../models/partials.model';

/**
 * Response for the `search` endpoint.
 *
 * @public
 */
export interface PlatformSearchResponse {
  banner: {
    content: PlatformBanner[];
  };
  catalog: {
    content: PlatformResult[];
    facets: PlatformFacet[];
    numFound: number;
    spellchecked: string;
    partials: PlatformPartialResult[];
    tagging: {
      query: string;
    };
  };
  direct: {
    content: PlatformRedirection[];
  };
  promoted: {
    content: PlatformPromoted[];
  };
}
