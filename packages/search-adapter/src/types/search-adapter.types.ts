import {
  ClicksRecommendationsRequest,
  NextQueriesRequest,
  QueriesRecommendationsRequest,
  RelatedTagsRequest,
  RequestOptions,
  SearchByIdRequest,
  SearchRequest,
  SectionRecommendationsRequest,
  SuggestionsRequest,
  TopRecommendationsRequest,
  TrackingRequest,
  UserRecommendationsRequest
} from './requests.types';
import {
  ClicksRecommendationsResponse,
  NextQueriesResponse,
  QueriesRecommendationsResponse,
  RelatedTagsResponse,
  SearchByIdResponse,
  SearchResponse,
  SectionRecommendationsResponse,
  SuggestionsResponse,
  TopRecommendationsResponse,
  UserRecommendationsResponse
} from './response.types';
import { DeepPartial } from './utils.types';

/**
 * SearchAdapter API with the required and optional functions to be implemented. It is the
 * convention should be followed to create a new adapter.
 *
 * @param Config - The type of the adapter configuration.
 * @public
 */
export interface SearchAdapter<Config = any> {
  // Required functions
  getNextQueries(request: NextQueriesRequest, requestOptions?: RequestOptions): Promise<NextQueriesResponse>;
  getTopRecommendations(request: TopRecommendationsRequest, requestOptions?: RequestOptions): Promise<TopRecommendationsResponse>;
  getSectionRecommendations(request: SectionRecommendationsRequest,
    requestOptions?: RequestOptions): Promise<SectionRecommendationsResponse>;
  getQueriesRecommendations(request: QueriesRecommendationsRequest,
    requestOptions?: RequestOptions): Promise<QueriesRecommendationsResponse>;
  getClicksRecommendations(request: ClicksRecommendationsRequest, requestOptions?: RequestOptions): Promise<ClicksRecommendationsResponse>;
  getUserRecommendations(request: UserRecommendationsRequest, requestOptions?: RequestOptions): Promise<UserRecommendationsResponse>;
  getRelatedTags(request: RelatedTagsRequest, requestOptions?: RequestOptions): Promise<RelatedTagsResponse>;
  getSuggestions(request: SuggestionsRequest, requestOptions?: RequestOptions): Promise<SuggestionsResponse>;
  search(request: SearchRequest, requestOptions?: RequestOptions): Promise<SearchResponse>;
  searchById(request: SearchByIdRequest, requestOptions?: RequestOptions): Promise<SearchByIdResponse>;
  track(request: TrackingRequest): Promise<void>;

  // Optional functions
  invalidateCache?(): void;
  setConfig?(config: DeepPartial<Config>): void;
  addConfigChangedListener?(listener: ConfigChangedListener<Config>): void;
  removeConfigChangedListener?(listener: ConfigChangedListener<Config>): void;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type ConfigChangedListener<T> = (newConfig: T) => void;
