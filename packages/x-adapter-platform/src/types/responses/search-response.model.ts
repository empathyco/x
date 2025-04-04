import type { PlatformBanner } from '../models/banner.model';
import type { PlatformFacet } from '../models/facet.model';
import type { PlatformPartialResult } from '../models/partials.model';
import type { PlatformPromoted } from '../models/promoted.model';
import type { PlatformRedirection } from '../models/redirection.model';
import type { PlatformResult } from '../models/result.model';

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
      display: string;
    };
    stats: {
      price: {
        min: number;
        max: number;
      };
    };
  };
  direct: {
    content: PlatformRedirection[];
  };
  promoted: {
    content: PlatformPromoted[];
  };
}
