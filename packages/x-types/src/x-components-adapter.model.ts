import type { EndpointAdapter } from '@empathyco/x-adapter'
import type {
  BrowseRequest,
  ExperienceControlsRequest,
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
  BrowseResponse,
  ExperienceControlsResponse,
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
  browse: EndpointAdapter<BrowseRequest, BrowseResponse>
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
}
