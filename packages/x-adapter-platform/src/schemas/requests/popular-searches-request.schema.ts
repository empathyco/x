import { createMutableSchema } from '@empathyco/x-adapter';
import { PopularSearchesRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesRequest } from '../../types/requests/popular-searches-request.model';

/**
 * Default implementation for the PopularSearchesRequestSchema.
 *
 * @public
 */
export const popularSearchesRequestSchema = createMutableSchema<
  PopularSearchesRequest,
  PlatformPopularSearchesRequest
>({
  start: 'start',
  rows: 'rows',
  extraParams: 'extraParams'
});
