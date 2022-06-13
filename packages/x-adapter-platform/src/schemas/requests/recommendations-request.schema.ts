import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { RecommendationsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformRecommendationsRequest } from '../../types/requests/recommendations-request.model';

export const recommendationsRequestMutableSchema = createMutableSchema<
  Schema<RecommendationsRequest, PlatformRecommendationsRequest>
>({
  start: 'start',
  rows: 'rows',
  origin: 'origin',
  extraParams: 'extraParams'
});
