import {
  Banner,
  NextQuery,
  Promoted,
  Redirection,
  RelatedTag,
  Result,
  Suggestion,
  TaggingInfo
} from '@empathyco/x-types';

export interface PlatformSearchResponse {
  banner: Contentable<PlatformBanner>;
  catalog: PlatformCatalog;
  direct: Contentable<PlatformRedirection>;
  promoted: Contentable<PlatformPromoted>;
}
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

export interface SearchResponse {
  results: Result[];
  facets: any[];
  totalResults: number;
  spellcheck: string;
  banners: Banner[];
  promoted: Promoted[];
  redirections: Redirection[];
  queryTagging: TaggingInfo;
}

export interface PlatformResult {
  name: string;
  averageRating?: number;
  id: string;
  images?: string[];
  image: string;
  price: number;
  sku?: string;
  url: string;
  tagging: PlatformTagging;
}

export interface PlatformFacet {
  facet: string;
  values: PlatformFacetFilter[];
}

export interface PlatformFacetFilter {
  count: number;
  filter: string;
  id: string;
  value: string;
}

export interface PlatformHierarchicalFilter extends PlatformFacetFilter {
  children: PlatformFacet;
}

export interface PlatformTagging {
  add2cart: string;
  checkout: string;
  click: string;
}

export interface PlatformPromoted {
  id: string;
  title: string;
  url: string;
  image_url: string;
  tagging?: {
    query: string;
  };
}
export interface PlatformBanner {
  id: string;
  title: string;
  url: string;
  image_url: string;
  tagging?: {
    query: string;
  };
}
export interface PlatformRedirection {
  id: string;
  url: string;
  tagging?: {
    click: string;
  };
}

export interface PlatformEmpathizeResponse {
  topTrends: {
    content: PlatformSuggestion[];
    spellcheck?: string;
  };
}

export interface PlatformSuggestion {
  title_raw: string;
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

export interface PlatformNextQuery {
  query: string;
  source: string;
  position: number;
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

export interface PlatformRelatedTag {
  query: string;
  tag: string;
  source: string;
  position: number;
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
