import type { ExtendableEndpointAdapter } from '@empathyco/x-adapter'
import type {
  AiQuestionsRequest,
  AiQuestionsResponse,
  AiTasksRequest,
  AiTasksResponse,
  ExperienceControlsRequest,
  ExperienceControlsResponse,
  IdentifierResultsRequest,
  IdentifierResultsResponse,
  NextQueriesRequest,
  NextQueriesResponse,
  PopularSearchesRequest,
  PopularSearchesResponse,
  QuerySuggestionsRequest,
  QuerySuggestionsResponse,
  RecommendationsRequest,
  RecommendationsResponse,
  RelatedPromptsRequest,
  RelatedPromptsResponse,
  RelatedTagsRequest,
  RelatedTagsResponse,
  SearchRequest,
  SearchResponse,
  SemanticQueriesRequest,
  SemanticQueriesResponse,
  TaggingRequest,
  XComponentsAdapter,
} from '@empathyco/x-types'

/**
 * Platform adapter interface.
 *
 * @public
 */
export interface PlatformAdapter extends XComponentsAdapter {
  search: ExtendableEndpointAdapter<SearchRequest, SearchResponse>
  popularSearches: ExtendableEndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>
  nextQueries: ExtendableEndpointAdapter<NextQueriesRequest, NextQueriesResponse>
  recommendations: ExtendableEndpointAdapter<RecommendationsRequest, RecommendationsResponse>
  querySuggestions: ExtendableEndpointAdapter<QuerySuggestionsRequest, QuerySuggestionsResponse>
  relatedPrompts: ExtendableEndpointAdapter<RelatedPromptsRequest, RelatedPromptsResponse>
  relatedTags: ExtendableEndpointAdapter<RelatedTagsRequest, RelatedTagsResponse>
  identifierResults: ExtendableEndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>
  semanticQueries: ExtendableEndpointAdapter<SemanticQueriesRequest, SemanticQueriesResponse>
  tagging: ExtendableEndpointAdapter<TaggingRequest, void>
  experienceControls: ExtendableEndpointAdapter<
    ExperienceControlsRequest,
    ExperienceControlsResponse
  >
  aiQuestions: ExtendableEndpointAdapter<AiQuestionsRequest, AiQuestionsResponse>
  aiTasks: ExtendableEndpointAdapter<AiTasksRequest, AiTasksResponse>
  aiOverviewSuggestions: ExtendableEndpointAdapter<AiQuestionsRequest, AiQuestionsResponse>
}
