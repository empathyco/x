import { DEFAULT_EMPATHY_ADAPTER_CONFIG } from '../config/empathy-adapter.config';
import { FetchHttpClient } from '../http-clients/fetch-http-client';
import { EmpathyClicksRecommendationsRequestMapper } from '../mappers/request/empathy-clicks-recommendations-request.mapper';
import { EmpathyQueriesRecommendationsRequestMapper } from '../mappers/request/empathy-queries-recommendations-request.mapper';
import { EmpathyQueryableRequestMapper } from '../mappers/request/empathy-queryable-request.mapper';
import { EmpathyRequestParamsMapper } from '../mappers/request/empathy-request-params.mapper';
import { EmpathySearchRequestMapper } from '../mappers/request/empathy-search-request.mapper';
import { EmpathySectionRecommendationsRequestMapper } from '../mappers/request/empathy-section-recommendations-request.mapper';
import { EmpathyUserInfoMapper } from '../mappers/request/empathy-user-data-request.mapper';
import { EmpathyRequestFiltersSolrSyntaxMapper } from '../mappers/request/params/empathy-request-filters-solr-syntax.mapper';
import { EmpathyRequestFiltersMapper } from '../mappers/request/params/empathy-request-filters.mapper';
import { EmpathyRequestQueryMapper } from '../mappers/request/params/empathy-request-query.mapper';
import { EmpathyRequestRelatedTagsQueryMapper } from '../mappers/request/params/empathy-request-related-tags-query.mapper';
import { EmpathyRequestSortMapper } from '../mappers/request/params/empathy-request-sort.mapper';
import { ResponseMappers } from '../mappers/response.mappers';
import { EmpathyBannerMapper } from '../mappers/response/empathy-banner.mapper';
import { EmpathyNextQueryMapper } from '../mappers/response/empathy-next-query.mapper';
import { EmpathyPartialResultMapper } from '../mappers/response/empathy-partial-result.mapper';
import { EmpathyPromotedMapper } from '../mappers/response/empathy-promoted.mapper';
import { EmpathyRedirectionMapper } from '../mappers/response/empathy-redirection.mapper';
import { EmpathyRelatedTagMapper } from '../mappers/response/empathy-related-tag.mapper';
import { EmpathySimpleValueMapper } from '../mappers/response/empathy-simple-value.mapper';
import { EmpathyTaggingMapper } from '../mappers/response/empathy-tagging.mapper';
import { EmpathyFacetMapper } from '../mappers/response/facets/empathy-facet.mapper';
import { EmpathyHierarchicalFacetMapper } from '../mappers/response/facets/empathy-hierarchical-facet.mapper';
import { EmpathyNumberRangeFacetMapper } from '../mappers/response/facets/empathy-number-range-facet.mapper';
import { EmpathySimpleFacetMapper } from '../mappers/response/facets/empathy-simple-facet.mapper';
import { EmpathyBooleanFilterMapper } from '../mappers/response/filters/empathy-boolean-filter.mapper';
import { EmpathyFacetFilterMapper } from '../mappers/response/filters/empathy-facet-filter.mapper';
import { EmpathyHierarchicalFilterMapper } from '../mappers/response/filters/empathy-hierarchical-filter.mapper';
import { EmpathyNumberRangeFilterMapper } from '../mappers/response/filters/empathy-number-range-filter.mapper';
import { EmpathySimpleFilterMapper } from '../mappers/response/filters/empathy-simple-filter.mapper';
import { EmpathyResultQueryTaggingMapper } from '../mappers/response/results/empathy-result-query-tagging.mapper';
import { EmpathyResultMapper } from '../mappers/response/results/empathy-result.mapper';
import { EmpathySuggestionFacetsMapper } from '../mappers/response/suggestions/empathy-suggestion-facets.mapper';
import { EmpathySuggestionMapper } from '../mappers/response/suggestions/empathy-suggestion.mapper';
import { BeaconTrackingRequestor } from '../requestors/beacon-tracking.requestor';
import { FeatureRequestor } from '../requestors/feature.requestor';
import { Requestors } from '../requestors/requestors';
import { EmpathyEndpointsService } from '../services/empathy-endpoints.service';
import { DEPENDENCIES } from './container.const';
import { BindingDictionary } from './container.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export const BINDINGS: BindingDictionary = {
  [DEPENDENCIES.config]: { toConstant: DEFAULT_EMPATHY_ADAPTER_CONFIG },
  [DEPENDENCIES.httpClient]: FetchHttpClient,
  [DEPENDENCIES.endpointsService]: EmpathyEndpointsService,
  [DEPENDENCIES.entityMappers]: ResponseMappers,
  [DEPENDENCIES.requestors]: Requestors,
  [DEPENDENCIES.featureName]: {
    toConstantWhenInjectedInto: {
      [DEPENDENCIES.Requestors.nextQueries]: 'nextQueries',
      [DEPENDENCIES.Requestors.topRecommendations]: 'topRecommendations',
      [DEPENDENCIES.Requestors.sectionRecommendations]: 'sectionRecommendations',
      [DEPENDENCIES.Requestors.clicksRecommendations]: 'clicksRecommendations',
      [DEPENDENCIES.Requestors.queriesRecommendations]: 'queriesRecommendations',
      [DEPENDENCIES.Requestors.userRecommendations]: 'userRecommendations',
      [DEPENDENCIES.Requestors.search]: 'search',
      [DEPENDENCIES.Requestors.relatedTags]: 'relatedTags',
      [DEPENDENCIES.Requestors.searchById]: 'searchById',
      [DEPENDENCIES.Requestors.suggestions]: 'suggestions',
      [DEPENDENCIES.Requestors.track]: 'track'
    }
  },
  // Requestors
  [DEPENDENCIES.Requestors.nextQueries]: FeatureRequestor,
  [DEPENDENCIES.Requestors.topRecommendations]: FeatureRequestor,
  [DEPENDENCIES.Requestors.sectionRecommendations]: FeatureRequestor,
  [DEPENDENCIES.Requestors.clicksRecommendations]: FeatureRequestor,
  [DEPENDENCIES.Requestors.queriesRecommendations]: FeatureRequestor,
  [DEPENDENCIES.Requestors.userRecommendations]: FeatureRequestor,
  [DEPENDENCIES.Requestors.search]: FeatureRequestor,
  [DEPENDENCIES.Requestors.relatedTags]: FeatureRequestor,
  [DEPENDENCIES.Requestors.searchById]: FeatureRequestor,
  [DEPENDENCIES.Requestors.suggestions]: FeatureRequestor,
  [DEPENDENCIES.Requestors.track]: BeaconTrackingRequestor,
  // Request mappers
  [DEPENDENCIES.requestMappers]: {
    default: EmpathyRequestParamsMapper,
    whenInjectedInto: {
      [DEPENDENCIES.Requestors.nextQueries]: EmpathyQueryableRequestMapper,
      [DEPENDENCIES.Requestors.topRecommendations]: EmpathyQueryableRequestMapper,
      [DEPENDENCIES.Requestors.sectionRecommendations]: [EmpathySectionRecommendationsRequestMapper, EmpathyUserInfoMapper],
      [DEPENDENCIES.Requestors.clicksRecommendations]: [EmpathyClicksRecommendationsRequestMapper, EmpathyUserInfoMapper],
      EmpathySectionRecommendationsRequestMapper,
      [DEPENDENCIES.Requestors.queriesRecommendations]: [
        EmpathyQueriesRecommendationsRequestMapper,
        EmpathySectionRecommendationsRequestMapper,
        EmpathyUserInfoMapper
      ],
      [DEPENDENCIES.Requestors.userRecommendations]: [EmpathyUserInfoMapper, EmpathySectionRecommendationsRequestMapper],
      [DEPENDENCIES.Requestors.search]: EmpathySearchRequestMapper,
      [DEPENDENCIES.Requestors.relatedTags]: EmpathyQueryableRequestMapper,
      [DEPENDENCIES.Requestors.searchById]: EmpathyQueryableRequestMapper,
      [DEPENDENCIES.Requestors.suggestions]: EmpathyQueryableRequestMapper
    }
  },
  // Request params mappers
  [DEPENDENCIES.RequestMappers.Parameters.query]: [EmpathyRequestRelatedTagsQueryMapper, EmpathyRequestQueryMapper],
  [DEPENDENCIES.RequestMappers.Parameters.filters]: EmpathyRequestFiltersMapper,
  [DEPENDENCIES.RequestMappers.Parameters.filtersValue]: EmpathyRequestFiltersSolrSyntaxMapper,
  [DEPENDENCIES.RequestMappers.Parameters.sort]: EmpathyRequestSortMapper,
  // Response mappers
  [DEPENDENCIES.ResponseMappers.banners]: EmpathyBannerMapper,
  [DEPENDENCIES.ResponseMappers.facets]: [
    EmpathyFacetMapper,
    EmpathySimpleFacetMapper,
    EmpathyHierarchicalFacetMapper,
    EmpathyNumberRangeFacetMapper
  ],
  [DEPENDENCIES.ResponseMappers.simpleFilter]: [EmpathyFacetFilterMapper, EmpathyBooleanFilterMapper, EmpathySimpleFilterMapper],
  [DEPENDENCIES.ResponseMappers.hierarchicalFilter]: [EmpathyFacetFilterMapper, EmpathyBooleanFilterMapper, EmpathyHierarchicalFilterMapper],
  [DEPENDENCIES.ResponseMappers.numberRangeFilter]: [EmpathyFacetFilterMapper, EmpathyBooleanFilterMapper, EmpathyNumberRangeFilterMapper],
  [DEPENDENCIES.ResponseMappers.nextQueries]: EmpathyNextQueryMapper,
  [DEPENDENCIES.ResponseMappers.partialResults]: EmpathyPartialResultMapper,
  [DEPENDENCIES.ResponseMappers.promoteds]: EmpathyPromotedMapper,
  [DEPENDENCIES.ResponseMappers.queryTagging]: EmpathyTaggingMapper,
  [DEPENDENCIES.ResponseMappers.redirections]: EmpathyRedirectionMapper,
  [DEPENDENCIES.ResponseMappers.relatedTags]: EmpathyRelatedTagMapper,
  [DEPENDENCIES.ResponseMappers.results]: {
    default: EmpathyResultMapper,
    whenAnyAncestorIs: {
      [DEPENDENCIES.Requestors.search]: EmpathyResultQueryTaggingMapper,
      [DEPENDENCIES.Requestors.searchById]: EmpathyResultQueryTaggingMapper
    }
  },
  [DEPENDENCIES.ResponseMappers.showTagging]: EmpathyTaggingMapper,
  [DEPENDENCIES.ResponseMappers.spellcheck]: EmpathySimpleValueMapper,
  [DEPENDENCIES.ResponseMappers.suggestions]: [EmpathySuggestionMapper, EmpathySuggestionFacetsMapper],
  [DEPENDENCIES.ResponseMappers.totalResults]: EmpathySimpleValueMapper,
  // Response helpers
  [DEPENDENCIES.ResponseMappers.Helpers.tagging]: EmpathyTaggingMapper
};
