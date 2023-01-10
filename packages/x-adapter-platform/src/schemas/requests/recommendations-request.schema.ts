import { createMutableSchema } from '@empathyco/x-adapter';
import { RecommendationsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformRecommendationsRequest } from '../../types/requests/recommendations-request.model';

export const recommendationsRequestSchema = createMutableSchema<
  RecommendationsRequest,
  PlatformRecommendationsRequest
>({
  start: 'start',
  rows: 'rows',
  origin: 'origin',
  extraParams: 'extraParams'
});
