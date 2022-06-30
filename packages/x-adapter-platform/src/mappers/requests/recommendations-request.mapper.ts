import { schemaMapperFactory } from '@empathyco/x-adapter';
import { RecommendationsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { recommendationsRequestSchema } from '../../schemas/requests/recommendations-request.schema';
// eslint-disable-next-line max-len
import { PlatformRecommendationsRequest } from '../../types/requests/recommendations-request.model';

export const recommendationsRequestMapper = schemaMapperFactory<
  RecommendationsRequest,
  PlatformRecommendationsRequest
>(recommendationsRequestSchema);
