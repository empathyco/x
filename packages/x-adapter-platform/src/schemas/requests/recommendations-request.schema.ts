import type { RecommendationsRequest } from '@empathyco/x-types';
import type { PlatformRecommendationsRequest } from '../../types/requests/recommendations-request.model';
 
import { createMutableSchema } from '@empathyco/x-adapter';

/**
 * Default implementation for the RecommendationsRequestSchema.
 *
 * @public
 */
export const recommendationsRequestSchema = createMutableSchema<
  RecommendationsRequest,
  PlatformRecommendationsRequest
>({
  start: 'start',
  rows: 'rows',
  origin: 'origin',
  extraParams: 'extraParams'
});
