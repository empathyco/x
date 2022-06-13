import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { RecommendationsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformRecommendationsResponse } from '../../types/responses/recommendations-response.model';
import { resultSchema } from '../models/result.schema';

export const recommendationsResponseMutableSchema = createMutableSchema<
  Schema<PlatformRecommendationsResponse, RecommendationsResponse>
>({
  results: {
    $path: 'topclicked.content',
    $subSchema: resultSchema
  }
});
