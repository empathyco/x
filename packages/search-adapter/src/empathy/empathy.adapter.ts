import { deepMerge } from '@empathybroker/deep-merge';
import { inject, injectable } from 'inversify';
import {
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
import { DeepPartial } from '../utils/utils.types';
import { EmpathyAdapterConfig } from './config/empathy-adapter-config.types';
import { DEPENDENCIES } from './container/container.const';
import { Requestor } from './empathy-adapter.types';

@injectable()
export class EmpathyAdapter implements SearchAdapter {
  constructor(
    @inject(DEPENDENCIES.config)
    private readonly config: EmpathyAdapterConfig,
    @inject(DEPENDENCIES.Requestors.nextQueries)
    private readonly nextQueriesRequestor: Requestor<NextQueriesRequest, NextQueriesResponse>,
    @inject(DEPENDENCIES.Requestors.recommendations)
    private readonly recommendationsRequestor: Requestor<RecommendationsRequest, RecommendationsResponse>,
    @inject(DEPENDENCIES.Requestors.relatedTags)
    private readonly relatedTagsRequestor: Requestor<RelatedTagsRequest, RelatedTagsResponse>,
    @inject(DEPENDENCIES.Requestors.searchById)
    private readonly searchByIdRequestor: Requestor<SearchByIdRequest, SearchByIdResponse>,
    @inject(DEPENDENCIES.Requestors.search)
    private readonly searchRequestor: Requestor<SearchRequest, SearchResponse>,
    @inject(DEPENDENCIES.Requestors.suggestions)
    private readonly suggestionsRequestor: Requestor<SuggestionsRequest, SuggestionsResponse>,
    @inject(DEPENDENCIES.Requestors.track)
    private readonly trackingRequestor: Requestor<TrackingRequest, void>
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

  setConfig(newConfig: DeepPartial<EmpathyAdapterConfig>): void {
    deepMerge(this.config, newConfig);
  }

  track(trackingRequest: TrackingRequest): Promise<void> {
    return this.trackingRequestor.request(trackingRequest);
  }
}
