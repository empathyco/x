import {
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
  RelatedTagsRequest,
  RelatedTagsResponse,
  SearchRequest,
  SearchResponse,
  SemanticQueriesRequest,
  SemanticQueriesResponse,
  TaggingRequest,
  ExperienceControlsRequest,
  XComponentsAdapter
} from '@empathyco/x-types';
import { ExtendableEndpointAdapter } from '@empathyco/x-adapter';
// eslint-disable-next-line max-len

/**
 * Platform adapter interface.
 *
 * @public
 */
export interface PlatformAdapter extends XComponentsAdapter {
  search: ExtendableEndpointAdapter<SearchRequest, SearchResponse>;
  popularSearches: ExtendableEndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>;
  nextQueries: ExtendableEndpointAdapter<NextQueriesRequest, NextQueriesResponse>;
  recommendations: ExtendableEndpointAdapter<RecommendationsRequest, RecommendationsResponse>;
  querySuggestions: ExtendableEndpointAdapter<QuerySuggestionsRequest, QuerySuggestionsResponse>;
  relatedTags: ExtendableEndpointAdapter<RelatedTagsRequest, RelatedTagsResponse>;
  identifierResults: ExtendableEndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>;
  semanticQueries: ExtendableEndpointAdapter<SemanticQueriesRequest, SemanticQueriesResponse>;
  tagging: ExtendableEndpointAdapter<TaggingRequest, void>;
  experienceControls: ExtendableEndpointAdapter<ExperienceControlsRequest, any>;
}
