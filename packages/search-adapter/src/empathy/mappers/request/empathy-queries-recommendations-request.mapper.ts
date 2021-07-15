import { injectable, multiInject } from 'inversify';
import { QueriesRecommendationsRequest } from '../../../types';
import { DEPENDENCIES } from '../../container/container.const';
import { MapRequest, RequestMapper, RequestMapperContext } from '../../empathy-adapter.types';
import { EmpathyQueriesRecommendationsRequest } from '../../models/requests/empathy-discovery-wall.request';
import { pipeMappers } from '../pipe-mappers';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyQueriesRecommendationsRequestMapper
  implements RequestMapper<QueriesRecommendationsRequest, EmpathyQueriesRecommendationsRequest> {
  private readonly mapQuery: MapRequest<string, string>;

  constructor(
    @multiInject(DEPENDENCIES.RequestMappers.Parameters.query) queryMapper: RequestMapper<string, string>[]
  ) {
    this.mapQuery = pipeMappers(...queryMapper);
  }

  map({ queries, userType, user, session, ...rest }: QueriesRecommendationsRequest, request: EmpathyQueriesRecommendationsRequest,
    context: RequestMapperContext)
    : EmpathyQueriesRecommendationsRequest {
    return Object.assign<EmpathyQueriesRecommendationsRequest, Partial<EmpathyQueriesRecommendationsRequest>>(request, {
        ...rest,
        query: queries.map(query => this.mapQuery(query, query, context))
      }
    );
  }
}
