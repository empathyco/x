import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { PopularSearchesResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesResponse } from '../../types/responses/popular-searches-response.model';
import { suggestionSchema } from '../models/suggestion.schema';

export const popularSearchesResponseSchema = createMutableSchema<
  Schema<PlatformPopularSearchesResponse, PopularSearchesResponse>
>({
  suggestions: {
    $path: 'topTrends.content',
    $subSchema: suggestionSchema
  }
});
