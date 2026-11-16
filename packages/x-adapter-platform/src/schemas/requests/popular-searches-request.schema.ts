import type { PopularSearchesRequest } from '@empathyco/x-types'
import type { PlatformPopularSearchesRequest } from '../../types/requests/popular-searches-request.model'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the PopularSearchesRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const popularSearchesRequestSchema = createMutableZodSchema<
  PopularSearchesRequest,
  PlatformPopularSearchesRequest
>({
  transform: (source): PlatformPopularSearchesRequest =>
    defined<PlatformPopularSearchesRequest>({
      start: source.start,
      rows: source.rows,
      extraParams: source.extraParams,
    }),
})
