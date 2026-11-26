import type { QuerySuggestionsRequest } from '@empathyco/x-types'
import type { PlatformQuerySuggestionsRequest } from '../../types/requests/query-suggestions-request.model'
import { createTransformSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the QuerySuggestionsRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const querySuggestionsRequestSchema = createTransformSchema<
  QuerySuggestionsRequest,
  PlatformQuerySuggestionsRequest
>({
  transform: (source): PlatformQuerySuggestionsRequest =>
    defined<PlatformQuerySuggestionsRequest>({
      query: source.query,
      start: source.start,
      rows: source.rows,
      extraParams: source.extraParams,
    }),
})
