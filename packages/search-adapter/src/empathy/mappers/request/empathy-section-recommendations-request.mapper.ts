import { injectable } from 'inversify';
import { SectionRecommendationsRequest } from '../../../types';
import { RequestMapper } from '../../empathy-adapter.types';
import { EmpathySectionRecommendationsRequest } from '../../models/requests/empathy-discovery-wall.request';

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
