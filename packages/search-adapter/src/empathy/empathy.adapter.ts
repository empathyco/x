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
  SearchByIdRequest,
  SearchByIdResponse,
  SearchRequest,
  SearchResponse,
  SuggestionsRequest,
  SuggestionsResponse,
  TrackingRequest
} from '../models';
import { DeepPartial } from '../utils/utils.types';
import { EmpathyAdapterConfig } from './config/empathy-adapter-config.types';
import { DEPENDENCIES } from './container/empathy-adapter-container.const';
import { requestor } from './container/empathy-adapter.decorators';
import { EmpathyAdapter, Requestor } from './empathy-adapter.types';

@injectable()
export class DefaultEmpathyAdapter implements EmpathyAdapter {
  @inject(DEPENDENCIES.config)
  private readonly config!: EmpathyAdapterConfig;
  @inject(DEPENDENCIES.Requestors.nextQueries)
  private readonly nextQueriesRequestor!: Requestor<NextQueriesRequest, NextQueriesResponse>;
  @requestor(DEPENDENCIES.Requestors.recommendations)
  private readonly recommendationsRequestor!: Requestor<RecommendationsRequest, RecommendationsResponse>;
  @inject(DEPENDENCIES.Requestors.relatedTags)
  private readonly relatedTagsRequestor!: Requestor<RelatedTagsRequest, RelatedTagsResponse>;
  @inject(DEPENDENCIES.Requestors.suggestions)
  private readonly suggestionsRequestor!: Requestor<SuggestionsRequest, SuggestionsResponse>;
  @inject(DEPENDENCIES.Requestors.search)
  private readonly searchRequestor!: Requestor<SearchRequest, SearchResponse>;
  @inject(DEPENDENCIES.Requestors.searchById)
  private readonly searchByIdRequestor!: Requestor<SearchByIdRequest, SearchByIdResponse>;
  @inject(DEPENDENCIES.Requestors.track)
  private readonly trackRequestor!: Requestor<TrackingRequest, void>;

  getNextQueries(request: NextQueriesRequest, requestOptions: Partial<RequestOptions> = {}): Promise<NextQueriesResponse> {
    return this.nextQueriesRequestor.request(request, requestOptions);
  }

  getRecommendations(request: RecommendationsRequest, requestOptions: Partial<RequestOptions> = {}): Promise<RecommendationsResponse> {
    return this.recommendationsRequestor.request(request, requestOptions);
  }

  getRelatedTags(request: RelatedTagsRequest, requestOptions: Partial<RequestOptions> = {}): Promise<RelatedTagsResponse> {
    return this.relatedTagsRequestor.request(request, requestOptions);
  }

  getSuggestions(request: SuggestionsRequest, requestOptions: Partial<RequestOptions> = {}): Promise<SuggestionsResponse> {
    return this.suggestionsRequestor.request(request, requestOptions);
  }

  search(request: SearchRequest, requestOptions: Partial<RequestOptions> = {}): Promise<SearchResponse> {
    return this.searchRequestor.request(request, requestOptions);
  }

  searchById(request: SearchByIdRequest, requestOptions: Partial<RequestOptions> = {}): Promise<SearchByIdResponse> {
    return this.searchByIdRequestor.request(request, requestOptions);
  }

  track(request: TrackingRequest): Promise<void> {
    return this.trackRequestor.request(request, {});
  }

  setConfig(newConfig: DeepPartial<EmpathyAdapterConfig>): void {
    deepMerge(this.config, newConfig);
  }
}
