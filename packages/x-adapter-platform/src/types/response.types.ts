import {
  Banner,
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

export interface RelatedTagsResponse {
  relatedTags: RelatedTag[];
}

export interface PlatformRelatedTagsResponse {
  data: {
    relatedtags: PlatformRelatedTag[];
  };
  status: number;
}
