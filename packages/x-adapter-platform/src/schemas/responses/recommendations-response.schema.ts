import type { RecommendationsResponse } from '@empathyco/x-types';
import type { PlatformRecommendationsResponse } from '../../types/responses/recommendations-response.model';
 
import { createMutableSchema } from '@empathyco/x-adapter';
import { resultSchema } from '../models/result.schema';

/**
 * Default implementation for the RecommendationsResponseSchema.
 *
 * @public
 */
export const recommendationsResponseSchema = createMutableSchema<
  PlatformRecommendationsResponse,
  RecommendationsResponse
>({
  results: {
    $path: 'topclicked.content',
    $subSchema: resultSchema
  }
});
