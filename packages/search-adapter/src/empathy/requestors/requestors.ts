import { inject, injectable } from 'inversify';
import {
  ClicksRecommendationsRequest,
  ClicksRecommendationsResponse,
  FeatureNames,
  NextQueriesRequest,
  NextQueriesResponse,
  QueriesRecommendationsRequest,
  QueriesRecommendationsResponse,
  RelatedTagsRequest,
  RelatedTagsResponse,
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
} from '../../types';
import { DEPENDENCIES } from '../container/container.const';
import { Requestor } from '../empathy-adapter.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class Requestors implements Record<FeatureNames, Requestor> {
  constructor(
    @inject(DEPENDENCIES.Requestors.nextQueries)
    public readonly nextQueries: Requestor<NextQueriesRequest, NextQueriesResponse>,
    @inject(DEPENDENCIES.Requestors.topRecommendations)
    public readonly topRecommendations: Requestor<TopRecommendationsRequest, TopRecommendationsResponse>,
    @inject(DEPENDENCIES.Requestors.sectionRecommendations)
    public readonly sectionRecommendations: Requestor<SectionRecommendationsRequest, SectionRecommendationsResponse>,
    @inject(DEPENDENCIES.Requestors.clicksRecommendations)
    public readonly clicksRecommendations: Requestor<ClicksRecommendationsRequest, ClicksRecommendationsResponse>,
    @inject(DEPENDENCIES.Requestors.queriesRecommendations)
    public readonly queriesRecommendations: Requestor<QueriesRecommendationsRequest, QueriesRecommendationsResponse>,
    @inject(DEPENDENCIES.Requestors.userRecommendations)
    public readonly userRecommendations: Requestor<UserRecommendationsRequest, UserRecommendationsResponse>,
    @inject(DEPENDENCIES.Requestors.relatedTags)
    public readonly relatedTags: Requestor<RelatedTagsRequest, RelatedTagsResponse>,
    @inject(DEPENDENCIES.Requestors.searchById)
    public readonly searchById: Requestor<SearchByIdRequest, SearchByIdResponse>,
    @inject(DEPENDENCIES.Requestors.search)
    public readonly search: Requestor<SearchRequest, SearchResponse>,
    @inject(DEPENDENCIES.Requestors.suggestions)
    public readonly suggestions: Requestor<SuggestionsRequest, SuggestionsResponse>,
    @inject(DEPENDENCIES.Requestors.track)
    public readonly track: Requestor<TrackingRequest, void>
  ) {}
}
