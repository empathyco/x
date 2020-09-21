import { injectable } from 'inversify';
import { ClicksRecommendationsRequest } from '../../../types';
import { RequestMapper } from '../../empathy-adapter.types';
import { EmpathyClicksRecommendationsRequest } from '../../models/requests/empathy-discovery-wall.request';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyClicksRecommendationsRequestMapper
  implements RequestMapper<ClicksRecommendationsRequest, EmpathyClicksRecommendationsRequest> {

  map({ productIds, userType, user, session, ...rest }: ClicksRecommendationsRequest,
    request: EmpathyClicksRecommendationsRequest): EmpathyClicksRecommendationsRequest {
    return Object.assign<EmpathyClicksRecommendationsRequest, Partial<EmpathyClicksRecommendationsRequest>>(request, {
        ...rest,
        productId: productIds
      }
    );
  }
}
