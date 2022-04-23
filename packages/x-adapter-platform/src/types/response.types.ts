import { Banner, Promoted, Redirection, Result, TaggingInfo } from '@empathyco/x-types';

export interface PlatformSearchResponse {
  banner: PlatformBanner;
  catalog: PlatformCatalog;
  direct: PlatformRedirection;
  promoted: PlatformPromoted;
}

export interface PlatformBanner {
  content: Banner[];
}

export interface PlatformPromoted {
  content: Promoted[];
}

export interface PlatformRedirection {
  content: Redirection[];
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
  promoteds: Promoted[];
  redirections: Redirection[];
  queryTagging: TaggingInfo;
}

export interface PlatformResult {
  // categories?: string[];
  // categoryIds?: string[];
  // categoryPaths?: string[];
  // color: string;
  // gender: string;
  // groupId?: string;
  // image: string;
  name: string;
  // availability?: boolean;
  averageRating?: number;
  // popularity?: number;
  // type?: string;
  // description: string;
  id: string;
  images: string[];
  // originalPrice: number;
  price: number;
  // score: number;
  sku: string;
  // source: string;
  // sourceWebsite: string;
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
  children: Record<string, any>[];
}

export interface PlatformTagging {
  add2cart: string;
  checkout: string;
  click: string;
}
