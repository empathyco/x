import { createMutableSchema } from '@empathyco/x-adapter';
import { PopularSearchesResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesResponse } from '../../types/responses/popular-searches-response.model';
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
