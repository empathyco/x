import { injectable } from 'inversify';
import { SectionRecommendationsRequest } from '../../../types';
import { RequestMapper } from '../../empathy-adapter.types';
import { EmpathySectionRecommendationsRequest } from '../../models/requests/empathy-discovery-wall.request';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathySectionRecommendationsRequestMapper
  implements RequestMapper<SectionRecommendationsRequest, EmpathySectionRecommendationsRequest> {

  map({ section, origin, rows, start }: SectionRecommendationsRequest,
    request: EmpathySectionRecommendationsRequest): EmpathySectionRecommendationsRequest {
    return Object.assign<EmpathySectionRecommendationsRequest, Partial<EmpathySectionRecommendationsRequest>>(request, {
        origin,
        section,
        rows,
        start
      }
    );
  }
}
