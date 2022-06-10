import {
  Banner,
  NextQuery,
  Promoted,
  Redirection,
  RelatedTag,
  Result,
  TaggingRequest
} from '@empathyco/x-types';

import {
  Contentable,
  PlatformBanner,
  PlatformCatalog,
  PlatformPromoted,
  PlatformRedirection,
  PlatformRelatedTag
} from './models.types';
import { PlatformResult } from './models/index';
import { PlatformNextQuery } from './models/next-query.model';

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
