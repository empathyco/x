import { schemaMapperFactory } from '@empathyco/x-adapter';
import { RecommendationsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { recommendationsResponseSchema } from '../../schemas/responses/recommendations-response.schema';
// eslint-disable-next-line max-len
import { PlatformRecommendationsResponse } from '../../types/responses/recommendations-response.model';

export const recommendationsResponseMapper = schemaMapperFactory<
  PlatformRecommendationsResponse,
  RecommendationsResponse
>(recommendationsResponseSchema);
