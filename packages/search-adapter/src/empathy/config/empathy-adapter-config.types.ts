import {
  FacetModelName,
  Filter,
  HierarchicalFacet,
  HierarchicalFilter,
  MultiSelect,
  NumberRangeFacet,
  NumberRangeFilter,
  SimpleFacet,
  SimpleFilter
} from '@empathy/search-types';
import {
  ClicksRecommendationsResponse,
  Dictionary,
  FeatureNames,
  NextQueriesResponse,
  QueriesRecommendationsResponse,
  RelatedTagsResponse,
  SearchByIdResponse,
  SearchResponse,
  SectionRecommendationsResponse,
  SuggestionsResponse,
  TopRecommendationsResponse,
  UserRecommendationsResponse
} from '../../types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
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

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface FeatureConfig<Feature extends FeatureNames> {
  endpoint: string;
  responsePaths: Record<(keyof (FeaturesResponseTypes[Feature]) | string), string>;
  cacheTTLInMinutes?: number;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface FeaturesResponseTypes {
  nextQueries: NextQueriesResponse;
  topRecommendations: TopRecommendationsResponse;
  sectionRecommendations: SectionRecommendationsResponse;
  clicksRecommendations: ClicksRecommendationsResponse;
  queriesRecommendations: QueriesRecommendationsResponse;
  userRecommendations: UserRecommendationsResponse;
  relatedTags: RelatedTagsResponse;
  search: SearchResponse;
  searchById: SearchByIdResponse;
  suggestions: SuggestionsResponse;
  track: void;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface QueryConfig {
  maxLength: number;
  maxWords: number;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface FacetsConfig {
  default: FacetConfig;
  named: Dictionary<FacetConfig>;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface FacetConfig {
  modelName: FacetModelName;
  isDynamic: boolean;
  multiSelectable: MultiSelect;
  showUnselectedValues: boolean;
  prefix: {
    facetId: string | ((context: FilterValueMapperParams) => string);
    noTagFacetId: string | ((context: FilterValueMapperParams) => string);
  };
}

/**
 * Params context of the filter value mapper.
 *
 * @remarks Facet id can be got from the filter as filter.facetId param.
 * @public
 */
export interface FilterValueMapperParams {
  config: EmpathyAdapterConfig;
  filter: Filter;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface TrackingResultConfig {
  add2cart: string;
  click: string;
  checkout: string;
  [key: string]: string;
}
