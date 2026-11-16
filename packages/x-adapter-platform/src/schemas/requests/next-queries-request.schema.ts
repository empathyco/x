import type { NextQueriesRequest } from '@empathyco/x-types'
import type { PlatformNextQueriesRequest } from '../../types/requests/next-queries-request.model'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the NextQueriesRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const nextQueriesRequestSchema = createMutableZodSchema<
  NextQueriesRequest,
  PlatformNextQueriesRequest
>({
  transform: (source): PlatformNextQueriesRequest =>
    defined<PlatformNextQueriesRequest>({
      query: source.query,
      extraParams: source.extraParams,
    }),
})
