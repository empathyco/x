import { DEFAULT_EMPATHY_ADAPTER_CONFIG } from '../config/empathy-adapter.config';
import { EmpathyEndpointsService } from '../endpoints-services/empathy-endpoints.service';
import { FetchHttpClient } from '../http-clients/fetch-http-client';
import { EmpathyResultMapper, EmpathyResultQueryTaggingMapper } from '../mappers';
import { EmpathyQueryableRequestMapper } from '../mappers/request/empathy-queryable-request.mapper';
import { EmpathyRequestParamsMapper } from '../mappers/request/empathy-request-params.mapper';
import { EmpathySearchRequestMapper } from '../mappers/request/empathy-search-request.mapper';
import { EmpathyRequestFiltersSolrSyntaxMapper } from '../mappers/request/params/empathy-request-filters-solr-syntax.mapper';
import { EmpathyRequestFiltersMapper } from '../mappers/request/params/empathy-request-filters.mapper';
import { EmpathyRequestQueryMapper } from '../mappers/request/params/empathy-request-query.mapper';
import { ResponseMappers } from '../mappers/response.mappers';
import { EmpathyBannerMapper } from '../mappers/response/empathy-banner.mapper';
import { EmpathyFacetMapper } from '../mappers/response/empathy-facet.mapper';
import { EmpathyNextQueryMapper } from '../mappers/response/empathy-next-query.mapper';
import { EmpathyPartialResultMapper } from '../mappers/response/empathy-partial-result.mapper';
import { EmpathyPromotedMapper } from '../mappers/response/empathy-promoted.mapper';
import { EmpathyQueryHighlightingMapper } from '../mappers/response/empathy-query-highlighting.mapper';
import { EmpathyRedirectionMapper } from '../mappers/response/empathy-redirection.mapper';
import { EmpathyRelatedTagMapper } from '../mappers/response/empathy-related-tag.mapper';
import { EmpathySimpleValueMapper } from '../mappers/response/empathy-simple-value.mapper';
import { EmpathyTaggingMapper } from '../mappers/response/empathy-tagging.mapper';
import { EmpathyFilterMapper } from '../mappers/response/filters/empathy-filter.mapper';
import { EmpathyRangeFilterMapper } from '../mappers/response/filters/empathy-range-filter.mapper';
import { EmpathySimpleFilterMapper } from '../mappers/response/filters/empathy-simple-filter.mapper';
import { EmpathySuggestionFacetsMapper } from '../mappers/response/suggestions/empathy-suggestion-facets.mapper';
import { EmpathySuggestionMapper } from '../mappers/response/suggestions/empathy-suggestion.mapper';
import { BeaconTrackingRequestor } from '../requestors/beacon-tracking.requestor';
import { FeatureRequestor } from '../requestors/feature.requestor';
import { DEPENDENCIES } from './container.const';
import { BindingDictionary } from './container.types';

export const BINDINGS: BindingDictionary = {
  [DEPENDENCIES.config]: { toConstant: DEFAULT_EMPATHY_ADAPTER_CONFIG },
  [DEPENDENCIES.httpClient]: FetchHttpClient,
  [DEPENDENCIES.endpointsService]: EmpathyEndpointsService,
  [DEPENDENCIES.entityMappers]: ResponseMappers,
  [DEPENDENCIES.featureName]: {
    toConstantWhenInjectedInto: {
      [DEPENDENCIES.Requestors.nextQueries]: 'nextQueries',
      [DEPENDENCIES.Requestors.recommendations]: 'recommendations',
      [DEPENDENCIES.Requestors.search]: 'search',
      [DEPENDENCIES.Requestors.relatedTags]: 'relatedTags',
      [DEPENDENCIES.Requestors.searchById]: 'searchById',
      [DEPENDENCIES.Requestors.suggestions]: 'suggestions',
      [DEPENDENCIES.Requestors.track]: 'track'
    }
  },
  // Requestors
  [DEPENDENCIES.Requestors.nextQueries]: FeatureRequestor,
  [DEPENDENCIES.Requestors.recommendations]: FeatureRequestor,
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
      [DEPENDENCIES.Requestors.recommendations]: EmpathyQueryableRequestMapper,
      [DEPENDENCIES.Requestors.search]: EmpathySearchRequestMapper,
      [DEPENDENCIES.Requestors.relatedTags]: EmpathyQueryableRequestMapper,
      [DEPENDENCIES.Requestors.searchById]: EmpathyQueryableRequestMapper,
      [DEPENDENCIES.Requestors.suggestions]: EmpathyQueryableRequestMapper
    }
  },
  // Request params mappers
  [DEPENDENCIES.RequestMappers.Parameters.query]: EmpathyRequestQueryMapper,
  [DEPENDENCIES.RequestMappers.Parameters.filters]: EmpathyRequestFiltersMapper,
  [DEPENDENCIES.RequestMappers.Parameters.filtersValue]: EmpathyRequestFiltersSolrSyntaxMapper,
  // Response mappers
  [DEPENDENCIES.ResponseMappers.banners]: EmpathyBannerMapper,
  [DEPENDENCIES.ResponseMappers.facets]: EmpathyFacetMapper,
  [DEPENDENCIES.ResponseMappers.filters]: [EmpathySimpleFilterMapper, EmpathyRangeFilterMapper, EmpathyFilterMapper],
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
  [DEPENDENCIES.ResponseMappers.spellcheck]: EmpathySimpleValueMapper,
  [DEPENDENCIES.ResponseMappers.suggestions]: [EmpathySuggestionMapper, EmpathySuggestionFacetsMapper],
  [DEPENDENCIES.ResponseMappers.totalResults]: EmpathySimpleValueMapper,
  // Response helpers
  [DEPENDENCIES.ResponseMappers.Helpers.tagging]: EmpathyTaggingMapper,
  [DEPENDENCIES.ResponseMappers.Helpers.queryHighlighting]: EmpathyQueryHighlightingMapper
};
