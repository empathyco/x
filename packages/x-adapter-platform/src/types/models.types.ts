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

export interface PlatformNextQuery {
  query: string;
  source: 'ORGANIC' | 'CURATED';
  position: number;
}

export interface PlatformRelatedTag {
  query: string;
  tag: string;
  source: 'ORGANIC' | 'CURATED';
  position: number;
}
