import type { EndpointAdapter } from '@empathyco/x-adapter'
import type {
  AiSuggestionsRequest,
  AiSuggestionsSearchRequest,
  BrowseRequest,
  ExperienceControlsRequest,
  FacetsRequest,
  IdentifierResultsRequest,
  NextQueriesRequest,
  PopularSearchesRequest,
  QuerySuggestionsRequest,
  RecommendationsRequest,
  RelatedPromptsRequest,
  RelatedTagsRequest,
  SearchRequest,
  SemanticQueriesRequest,
  TaggingRequest,
} from './request'
import type {
  AiSuggestionsSearchResponse,
  BrowseResponse,
  ExperienceControlsResponse,
  FacetsResponse,
  IdentifierResultsResponse,
  NextQueriesResponse,
  PopularSearchesResponse,
  QuerySuggestionsResponse,
  RecommendationsResponse,
  RelatedPromptsResponse,
  RelatedTagsResponse,
  SearchResponse,
  SemanticQueriesResponse,
} from './response'

/**
 * XComponentsAdapter.
 * @public
 */
export interface XComponentsAdapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>
  popularSearches: EndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>
  nextQueries: EndpointAdapter<NextQueriesRequest, NextQueriesResponse>
  recommendations: EndpointAdapter<RecommendationsRequest, RecommendationsResponse>
  querySuggestions: EndpointAdapter<QuerySuggestionsRequest, QuerySuggestionsResponse>
  relatedPrompts: EndpointAdapter<RelatedPromptsRequest, RelatedPromptsResponse>
  relatedTags: EndpointAdapter<RelatedTagsRequest, RelatedTagsResponse>
  identifierResults: EndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>
  tagging: EndpointAdapter<TaggingRequest, void>
  semanticQueries: EndpointAdapter<SemanticQueriesRequest, SemanticQueriesResponse>
  experienceControls: EndpointAdapter<ExperienceControlsRequest, ExperienceControlsResponse>
  aiSuggestionsSearch: EndpointAdapter<AiSuggestionsSearchRequest, AiSuggestionsSearchResponse>
  aiSuggestions: EndpointAdapter<AiSuggestionsRequest, Response>
  facets: EndpointAdapter<FacetsRequest, FacetsResponse>
  browse: EndpointAdapter<BrowseRequest, BrowseResponse>
}
