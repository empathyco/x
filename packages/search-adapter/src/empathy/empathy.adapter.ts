import { deepMerge } from '@empathybroker/deep-merge';
import { inject, injectable, optional } from 'inversify';
import {
  ClicksRecommendationsRequest,
  ClicksRecommendationsResponse,
  DeepPartial,
  FeatureNames,
  NextQueriesRequest,
  NextQueriesResponse,
  QueriesRecommendationsRequest,
  QueriesRecommendationsResponse,
  RelatedTagsRequest,
  RelatedTagsResponse,
  RequestOptions,
  SearchAdapter,
  SearchByIdRequest,
  SearchByIdResponse,
  SearchRequest,
  SearchResponse,
  SectionRecommendationsRequest,
  SectionRecommendationsResponse,
  SuggestionsRequest,
  SuggestionsResponse,
  TopRecommendationsRequest,
  TopRecommendationsResponse,
  TrackingRequest,
  UserRecommendationsRequest,
  UserRecommendationsResponse
} from '../types';
import { EmpathyAdapterConfig } from './config/empathy-adapter-config.types';
import { DEPENDENCIES } from './container/container.const';
import { EmpathyAdapterConfigChangedListener, Requestor } from './empathy-adapter.types';
import { CacheService } from './services/cache-service.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyAdapter implements SearchAdapter<EmpathyAdapterConfig> {
  protected configChangedListeners: Set<EmpathyAdapterConfigChangedListener> = new Set();

  constructor(
    @inject(DEPENDENCIES.config)
    protected readonly config: EmpathyAdapterConfig,
    @inject(DEPENDENCIES.requestors)
    protected readonly requestors: Record<FeatureNames, Requestor>,
    @optional() @inject(DEPENDENCIES.cacheService)
    protected readonly cache: CacheService
  ) {}

  getNextQueries(request: NextQueriesRequest, requestOptions: RequestOptions = {}): Promise<NextQueriesResponse> {
    return this.requestors.nextQueries.request(request, requestOptions);
  }

  getTopRecommendations(request: TopRecommendationsRequest, requestOptions: RequestOptions = {}): Promise<TopRecommendationsResponse> {
    return this.requestors.topRecommendations.request(request, requestOptions);
  }

  getClicksRecommendations(request: ClicksRecommendationsRequest, requestOptions?: RequestOptions): Promise<ClicksRecommendationsResponse> {
    return this.requestors.clicksRecommendations.request(request, requestOptions);
  }

  getQueriesRecommendations(request: QueriesRecommendationsRequest,
    requestOptions?: RequestOptions): Promise<QueriesRecommendationsResponse> {
    return this.requestors.queriesRecommendations.request(request, requestOptions);
  }

  getSectionRecommendations(request: SectionRecommendationsRequest,
    requestOptions?: RequestOptions): Promise<SectionRecommendationsResponse> {
    return this.requestors.sectionRecommendations.request(request, requestOptions);
  }

  getUserRecommendations(request: UserRecommendationsRequest, requestOptions?: RequestOptions): Promise<UserRecommendationsResponse> {
    return this.requestors.userRecommendations.request(request, requestOptions);
  }

  getRelatedTags(request: RelatedTagsRequest, requestOptions: RequestOptions = {}): Promise<RelatedTagsResponse> {
    return this.requestors.relatedTags.request(request, requestOptions);
  }

  getSuggestions(request: SuggestionsRequest, requestOptions: RequestOptions = {}): Promise<SuggestionsResponse> {
    return this.requestors.suggestions.request(request, requestOptions);
  }

  search(request: SearchRequest, requestOptions: RequestOptions = {}): Promise<SearchResponse> {
    return this.requestors.search.request(request, requestOptions);
  }

  searchById(request: SearchByIdRequest, requestOptions: RequestOptions = {}): Promise<SearchByIdResponse> {
    return this.requestors.searchById.request(request, requestOptions);
  }

  track(trackingRequest: TrackingRequest): Promise<void> {
    return this.requestors.track.request(trackingRequest);
  }

  invalidateCache(): void {
    if (this.cache) {
      this.cache.clear();
    }
  }

  setConfig(newConfig: DeepPartial<EmpathyAdapterConfig>): void {
    deepMerge(this.config, newConfig);
    this.notifyConfigChangedListeners();
  }

  addConfigChangedListener(listener: EmpathyAdapterConfigChangedListener): void {
    this.configChangedListeners.add(listener);
  }

  removeConfigChangedListener(listener: EmpathyAdapterConfigChangedListener): void {
    this.configChangedListeners.delete(listener);
  }

  protected notifyConfigChangedListeners() {
    this.configChangedListeners.forEach(listener => {
      listener(this.config);
    });
  }
}
