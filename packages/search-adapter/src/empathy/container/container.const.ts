export const DEPENDENCIES = {
  httpClient: 'HttpClient',
  endpointsService: 'EndpointsService',
  cacheService: 'CacheService',
  storageService: 'StorageService',
  config: 'Config',
  entityMappers: 'EntityMappers',
  featureName: 'FeatureName',
  requestMappers: 'RequestMappers',
  Hooks: {
    beforeRequest: 'BeforeRequestHook',
    beforeResponseTransformed: 'BeforeResponseTransformedHook',
    responseTransformed: 'ResponseTransformedHook'
  },
  Requestors: {
    search: 'SearchRequestor',
    nextQueries: 'NextQueriesRequestor',
    recommendations: 'ReccommendationsRequestor',
    relatedTags: 'RelatedTagsRequestor',
    suggestions: 'SuggestionsRequestor',
    searchById: 'SearchByIdRequestor',
    track: 'TrackRequestor'
  },
  RequestMappers: {
    Parameters: {
      query: 'RequestQueryMapper',
      filters: 'RequestFiltersMapper',
      filtersValue: 'FiltersValueMapper'
    }
  },
  ResponseMappers: {
    Helpers: {
      queryHighlighting: 'QueryHighlightingMapper',
      tagging: 'TaggingMapper'
    },
    banners: 'BannersMapper',
    facets: 'FacetsMapper',
    filters: 'FiltersMapper',
    nextQueries: 'NextQueriesMapper',
    partialResults: 'PartialResultsMapper',
    promoteds: 'PromotedsMapper',
    queryTagging: 'QueryTaggingMapper',
    redirections: 'RedirectionsMapper',
    relatedTags: 'RelatedTagsMapper',
    results: 'ResultsMapper',
    spellcheck: 'SpellcheckMapper',
    suggestions: 'SuggestionsMapper',
    totalResults: 'TotalResultsMapper'
  }
};
