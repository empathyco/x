import { Banner, Promoted, Redirection, Result, TaggingInfo } from '@empathyco/x-types';

export interface PlatformSearchResponse {
  banner: PlatformBanner;
  catalog: PlatformCatalog;
  direct: PlatformRedirection;
  promoted: PlatformPromoted;
}

export interface PlatformBanner {
  content: PlatformBannerItem[];
}

export interface PlatformPromoted {
  content: PlatformPromotedItem[];
}

export interface PlatformRedirection {
  content: PlatformRedirectionItem[];
}

export interface PlatformCatalog {
  content: PlatformResult[];
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

export interface PlatformPromotedItem {
  id: string;
  title: string;
  url: string;
  image_url: string;
  tagging?: {
    query: string;
  };
}
export interface PlatformBannerItem {
  id: string;
  title: string;
  url: string;
  image_url: string;
  tagging?: {
    query: string;
  };
}
export interface PlatformRedirectionItem {
  id: string;
  url: string;
  tagging?: {
    click: string;
  };
}
