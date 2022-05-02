import { Banner, Promoted, Redirection, Result, TaggingInfo } from '@empathyco/x-types';

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
