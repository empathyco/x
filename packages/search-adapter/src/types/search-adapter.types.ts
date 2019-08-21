import {
  NextQueriesRequest,
  RecommendationsRequest,
  RelatedTagsRequest,
  RequestOptions,
  SearchByIdRequest,
  SearchRequest,
  SuggestionsRequest,
  TrackingRequest
} from './requests.types';
import {
  NextQueriesResponse,
  RecommendationsResponse,
  RelatedTagsResponse,
  SearchByIdResponse,
  SearchResponse,
  SuggestionsResponse
} from './response.types';

export interface SearchAdapter {
  // Required functions
  getNextQueries(request: NextQueriesRequest, requestOptions?: RequestOptions): Promise<NextQueriesResponse>;
  getRecommendations(request: RecommendationsRequest, requestOptions?: RequestOptions): Promise<RecommendationsResponse>;
  getRelatedTags(request: RelatedTagsRequest, requestOptions?: RequestOptions): Promise<RelatedTagsResponse>;
  getSuggestions(request: SuggestionsRequest, requestOptions?: RequestOptions): Promise<SuggestionsResponse>;
  search(request: SearchRequest, requestOptions?: RequestOptions): Promise<SearchResponse>;
  searchById(request: SearchByIdRequest, requestOptions?: RequestOptions): Promise<SearchByIdResponse>;
  track(request: TrackingRequest): Promise<void>;

  // Optional functions
  invalidateCache?(): void;
  setConfig?<T>(config: T): void;
}
