import type { EndpointAdapter } from '@empathyco/x-adapter'
import type {
  AiQuestionsRequest,
  AiTasksRequest,
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
  AiQuestionsResponse,
  AiTasksResponse,
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
  aiQuestions: EndpointAdapter<AiQuestionsRequest, AiQuestionsResponse>
  aiTasks: EndpointAdapter<AiTasksRequest, AiTasksResponse>
}
