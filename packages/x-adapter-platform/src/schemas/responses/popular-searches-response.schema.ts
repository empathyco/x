import type { PopularSearchesResponse } from '@empathyco/x-types';
import type { PlatformPopularSearchesResponse } from '../../types/responses/popular-searches-response.model';
 
import { createMutableSchema } from '@empathyco/x-adapter';
import { suggestionSchema } from '../models/suggestion.schema';

/**
 * Default implementation for the PopularSearchesResponseSchema.
 *
 * @public
 */
export const popularSearchesResponseSchema = createMutableSchema<
  PlatformPopularSearchesResponse,
  PopularSearchesResponse
>({
  suggestions: {
    $path: 'topTrends.content',
    $subSchema: suggestionSchema
  }
});
