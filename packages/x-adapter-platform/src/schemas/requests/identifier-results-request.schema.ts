import type { IdentifierResultsRequest } from '@empathyco/x-types'
import type { PlatformIdentifierResultsRequest } from '../../types/requests/identifier-results-request.model'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the IdentifierResultsRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const identifierResultsRequestSchema = createMutableZodSchema<
  IdentifierResultsRequest,
  PlatformIdentifierResultsRequest
>({
  transform: (source): PlatformIdentifierResultsRequest =>
    defined<PlatformIdentifierResultsRequest>({
      query: source.query,
      origin: source.origin,
      start: source.start,
      rows: source.rows,
      extraParams: source.extraParams,
    }),
})
