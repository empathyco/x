import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { RecommendationsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { recommendationsResponseMutableSchema } from '../../schemas/response/recommendations-response.schema';
// eslint-disable-next-line max-len
import { PlatformRecommendationsResponse } from '../../types/responses/recommendations-response.model';

export const recommendationsResponseMapper = schemaMapperFactory<
  PlatformRecommendationsResponse,
  RecommendationsResponse
>(recommendationsResponseMutableSchema);
