import { Filter, MultiSelect } from '@empathy/search-types';
import {
  Dictionary,
  FeatureNames,
  NextQueriesResponse,
  RecommendationsResponse,
  RelatedTagsResponse,
  SearchByIdResponse,
  SearchResponse,
  SuggestionsResponse
} from '../../types';

export interface EmpathyAdapterConfig {
  env: 'live' | 'staging' | 'test';
  instance: string;
  requestParams: {
    lang: string;
    scope: string;
    [key: string]: string;
  };
  features: { [feature in FeatureNames]: FeatureConfig<feature> };
  mappings: {
    query: QueryConfig,
    facets: FacetsConfig,
    tracking: {
      result: TrackingResultConfig
    }
  };
}

export interface FeatureConfig<Feature extends FeatureNames> {
  endpoint: string;
  responsePaths: Record<(keyof (FeaturesResponseTypes[Feature]) | string), string>;
  cacheTTLInMinutes?: number;
}

export interface FeaturesResponseTypes {
  nextQueries: NextQueriesResponse;
  recommendations: RecommendationsResponse;
  relatedTags: RelatedTagsResponse;
  search: SearchResponse;
  searchById: SearchByIdResponse;
  suggestions: SuggestionsResponse;
  track: void;
}

export interface QueryConfig {
  maxLength: number;
  maxWords: number;
}

export interface FacetsConfig {
  default: FacetConfig;
  named: Dictionary<FacetConfig>;
}

export interface FacetConfig {
  filterModelName: string;
  isDynamic: boolean;
  multiSelectable: MultiSelect;
  preselected: boolean;
  showUnselectedValues: boolean;
  prefix: {
    facetName: string | ((context: FilterValueMapperParams) => string);
    noTagFacetName: string | ((context: FilterValueMapperParams) => string);
  };
}

export interface FilterValueMapperParams {
  config: EmpathyAdapterConfig;
  facetName: string;
  filter: Filter;
  filterDeepness: number;
}

export interface TrackingResultConfig {
  add2cart: string;
  click: string;
  [key: string]: string;
}
