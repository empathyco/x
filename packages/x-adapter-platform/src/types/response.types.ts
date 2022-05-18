import {
  Banner,
  NextQuery,
  Promoted,
  Redirection,
  RelatedTag,
  Result,
  Suggestion,
  TaggingRequest
} from '@empathyco/x-types';

import {
  Contentable,
  PlatformBanner,
  PlatformCatalog,
  PlatformNextQuery,
  PlatformPromoted,
  PlatformRedirection,
  PlatformRelatedTag,
  PlatformResult,
  PlatformSuggestion
} from './models.types';

export interface PlatformSearchResponse {
  banner: Contentable<PlatformBanner>;
  catalog: PlatformCatalog;
  direct: Contentable<PlatformRedirection>;
  promoted: Contentable<PlatformPromoted>;
}

export interface SearchResponse {
  results: Result[];
  facets: any[];
  totalResults: number;
  spellcheck: string;
  banners: Banner[];
  promoted: Promoted[];
  redirections: Redirection[];
  queryTagging: TaggingRequest;
}

export interface PlatformEmpathizeResponse {
  topTrends: {
    content: PlatformSuggestion[];
    spellcheck?: string;
  };
}

export interface EmpathizeResponse {
  suggestions: Suggestion[];
  spellcheck?: string;
}

export interface PlatformTopClickedResponse {
  topclicked: {
    content: PlatformResult[];
    numFound: number;
  };
}

export interface TopClickedResponse {
  results: Result[];
}

export interface NextQueriesResponse {
  nextQueries: NextQuery[];
}

export interface PlatformNextQueriesResponse {
  data: {
    nextqueries: PlatformNextQuery[];
  };
}

export interface RelatedTagsResponse {
  relatedTags: RelatedTag[];
}

export interface PlatformRelatedTagsResponse {
  data: {
    relatedtags: PlatformRelatedTag[];
  };
  status: number;
}

export interface PlatformSkuSearchResponse {
  catalog: {
    content: PlatformResult[];
    tagging: {
      query: string;
    };
  };
}

export interface SkuSearchResponse {
  results: Result[];
}
