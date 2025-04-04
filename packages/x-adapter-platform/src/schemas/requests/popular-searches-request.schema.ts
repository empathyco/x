import type { PopularSearchesRequest } from '@empathyco/x-types'
import type { PlatformPopularSearchesRequest } from '../../types/requests/popular-searches-request.model'

import { createMutableSchema } from '@empathyco/x-adapter'

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
  extraParams: 'extraParams',
})
