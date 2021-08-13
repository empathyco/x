/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export const DEPENDENCIES = {
  httpClient: 'HttpClient',
  endpointsService: 'EndpointsService',
  cacheService: 'CacheService',
  storageService: 'StorageService',
  config: 'Config',
  entityMappers: 'EntityMappers',
  featureName: 'FeatureName',
  requestMappers: 'RequestMappers',
  requestors: 'Requestors',
  Hooks: {
    beforeRequest: 'BeforeRequestHook',
    beforeResponseTransformed: 'BeforeResponseTransformedHook',
    responseTransformed: 'ResponseTransformedHook'
  },
  Requestors: {
    search: 'SearchRequestor',
    nextQueries: 'NextQueriesRequestor',
    topRecommendations: 'TopRecommendationsRequestor',
    sectionRecommendations: 'SectionRecommendationsRequestor',
    clicksRecommendations: 'ClicksRecommendationsRequestor',
    queriesRecommendations: 'QueriesRecommendationsRequestor',
    userRecommendations: 'UserRecommendationsRequestor',
    relatedTags: 'RelatedTagsRequestor',
    suggestions: 'SuggestionsRequestor',
    searchById: 'SearchByIdRequestor',
    track: 'TrackRequestor'
  },
  RequestMappers: {
    Parameters: {
      query: 'RequestQueryMapper',
      sort: 'RequestSortMapper',
      filters: 'RequestFiltersMapper',
      filtersValue: 'FiltersValueMapper'
    }
  },
  ResponseMappers: {
    Helpers: {
      tagging: 'TaggingMapper'
    },
    banners: 'BannersMapper',
    facets: 'FacetsMapper',
    simpleFilter: 'SimpleFilterMapper',
    hierarchicalFilter: 'HierarchicalFilterMapper',
    numberRangeFilter: 'NumberRangeFilterMapper',
    nextQueries: 'NextQueriesMapper',
    partialResults: 'PartialResultsMapper',
    promoteds: 'PromotedsMapper',
    queryTagging: 'QueryTaggingMapper',
    showTagging: 'ShowTaggingMapper',
    redirections: 'RedirectionsMapper',
    relatedTags: 'RelatedTagsMapper',
    results: 'ResultsMapper',
    spellcheck: 'SpellcheckMapper',
    suggestions: 'SuggestionsMapper',
    totalResults: 'TotalResultsMapper'
  }
};
