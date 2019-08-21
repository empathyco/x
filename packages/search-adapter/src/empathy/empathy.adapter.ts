import { deepMerge } from '@empathybroker/deep-merge';
import { inject, injectable, optional } from 'inversify';
import {
  DeepPartial,
  NextQueriesRequest,
  NextQueriesResponse,
  RecommendationsRequest,
  RecommendationsResponse,
  RelatedTagsRequest,
  RelatedTagsResponse,
  RequestOptions,
  SearchAdapter,
  SearchByIdRequest,
  SearchByIdResponse,
  SearchRequest,
  SearchResponse,
  SuggestionsRequest,
  SuggestionsResponse,
  TrackingRequest
} from '../types';
import { EmpathyAdapterConfig } from './config/empathy-adapter-config.types';
import { DEPENDENCIES } from './container/container.const';
import { Requestor } from './empathy-adapter.types';
import { CacheService } from './services/cache-service.types';

@injectable()
export class EmpathyAdapter implements SearchAdapter {
  constructor(
    @inject(DEPENDENCIES.config)
    protected readonly config: EmpathyAdapterConfig,
    @inject(DEPENDENCIES.Requestors.nextQueries)
    protected readonly nextQueriesRequestor: Requestor<NextQueriesRequest, NextQueriesResponse>,
    @inject(DEPENDENCIES.Requestors.recommendations)
    protected readonly recommendationsRequestor: Requestor<RecommendationsRequest, RecommendationsResponse>,
    @inject(DEPENDENCIES.Requestors.relatedTags)
    protected readonly relatedTagsRequestor: Requestor<RelatedTagsRequest, RelatedTagsResponse>,
    @inject(DEPENDENCIES.Requestors.searchById)
    protected readonly searchByIdRequestor: Requestor<SearchByIdRequest, SearchByIdResponse>,
    @inject(DEPENDENCIES.Requestors.search)
    protected readonly searchRequestor: Requestor<SearchRequest, SearchResponse>,
    @inject(DEPENDENCIES.Requestors.suggestions)
    protected readonly suggestionsRequestor: Requestor<SuggestionsRequest, SuggestionsResponse>,
    @inject(DEPENDENCIES.Requestors.track)
    protected readonly trackingRequestor: Requestor<TrackingRequest, void>,
    @optional() @inject(DEPENDENCIES.cacheService)
    protected readonly cache: CacheService
  ) {}

  getNextQueries(request: NextQueriesRequest, requestOptions: RequestOptions = {}): Promise<NextQueriesResponse> {
    return this.nextQueriesRequestor.request(request, requestOptions);
  }

  getRecommendations(request: RecommendationsRequest, requestOptions: RequestOptions = {}): Promise<RecommendationsResponse> {
    return this.recommendationsRequestor.request(request, requestOptions);
  }

  getRelatedTags(request: RelatedTagsRequest, requestOptions: RequestOptions = {}): Promise<RelatedTagsResponse> {
    return this.relatedTagsRequestor.request(request, requestOptions);
  }

  getSuggestions(request: SuggestionsRequest, requestOptions: RequestOptions = {}): Promise<SuggestionsResponse> {
    return this.suggestionsRequestor.request(request, requestOptions);
  }

  search(request: SearchRequest, requestOptions: RequestOptions = {}): Promise<SearchResponse> {
    return this.searchRequestor.request(request, requestOptions);
  }

  searchById(request: SearchByIdRequest, requestOptions: RequestOptions = {}): Promise<SearchByIdResponse> {
    return this.searchByIdRequestor.request(request, requestOptions);
  }

  track(trackingRequest: TrackingRequest): Promise<void> {
    return this.trackingRequestor.request(trackingRequest);
  }

  invalidateCache(): void {
    if(this.cache) {
      this.cache.clear();
    }
  }

  setConfig(newConfig: DeepPartial<EmpathyAdapterConfig>): void {
    deepMerge(this.config, newConfig);
  }
}
