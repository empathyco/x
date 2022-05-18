import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { RecommendationsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { BasePlatformRecommendationsRequest } from '../../types/requests/recommendations-request.model';

export const recommendationsRequestSchema: Schema<
  RecommendationsRequest,
  BasePlatformRecommendationsRequest
> = {
  start: 'start',
  rows: 'rows',
  origin: 'origin'
};

export const recommendationsRequestMutableSchema = createMutableSchema(
  recommendationsRequestSchema
);
