import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { RecommendationsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformRecommendationsResponse } from '../../types/responses/recommendations-response.model';
import { resultMutableSchema } from './models/result.schema';

export const recommendationsResponseSchema: Schema<
  PlatformRecommendationsResponse,
  RecommendationsResponse
> = {
  results: {
    $path: 'topclicked.content',
    $subSchema: resultMutableSchema
  }
};

export const recommendationsResponseMutableSchema = createMutableSchema(
  recommendationsResponseSchema
);
