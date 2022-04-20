import { Banner, Facet, Promoted, Redirection, Result } from '@empathyco/x-types';

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
  content: Result[];
  facets: Facet[];
  numFound: number;
  spellchecked: string;
  tagging: {
    query: string;
  };
}

export interface SearchResponse {
  results: Result[];
  facets: Facet[];
  totalResults: number;
  spellcheck: string;
  banners: Banner[];
  promoteds: Promoted[];
  redirections: Redirection[];
  queryTagging: string;
}
