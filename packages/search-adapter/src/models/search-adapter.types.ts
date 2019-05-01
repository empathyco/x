import {
  NextQueriesRequest,
  NextQueriesResponse,
  RecommendationsRequest,
  RecommendationsResponse,
  RelatedTagsRequest,
  RelatedTagsResponse,
  RequestOptions,
  SearchByIdRequest,
  SearchByIdResponse,
  SearchRequest,
  SearchResponse,
  SuggestionsRequest,
  SuggestionsResponse,
  TrackingRequest
} from './requests.types';

export interface Adapter {
  getNextQueries(request: NextQueriesRequest, requestOptions?: Partial<RequestOptions>): Promise<NextQueriesResponse>;
  getRecommendations(request: RecommendationsRequest, requestOptions?: Partial<RequestOptions>): Promise<RecommendationsResponse>;
  getRelatedTags(request: RelatedTagsRequest, requestOptions?: Partial<RequestOptions>): Promise<RelatedTagsResponse>;
  getSuggestions(request: SuggestionsRequest, requestOptions?: Partial<RequestOptions>): Promise<SuggestionsResponse>;
  search(request: SearchRequest, requestOptions?: Partial<RequestOptions>): Promise<SearchResponse>;
  searchById(request: SearchByIdRequest, requestOptions?: Partial<RequestOptions>): Promise<SearchByIdResponse>;
  track(request: TrackingRequest): Promise<void>;
}
