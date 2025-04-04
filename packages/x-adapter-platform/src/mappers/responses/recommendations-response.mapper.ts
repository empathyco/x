import type { RecommendationsResponse } from '@empathyco/x-types';
import type { PlatformRecommendationsResponse } from '../../types/responses/recommendations-response.model';
 
import { schemaMapperFactory } from '@empathyco/x-adapter';
 
import { recommendationsResponseSchema } from '../../schemas/responses/recommendations-response.schema';

/**
 * Default implementation for the RecommendationsResponseMapper.
 *
 * @public
 */
export const recommendationsResponseMapper = schemaMapperFactory<
  PlatformRecommendationsResponse,
  RecommendationsResponse
>(recommendationsResponseSchema);
