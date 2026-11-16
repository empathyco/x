import type { SearchRequest } from '@empathyco/x-types'
import type { PlatformSearchRequest } from '../../types/requests/search-request.model'
import { createTransformSchema } from '@empathyco/x-adapter'
import { mapFilters } from '../../mappers/filter.utils'
import { defined } from '../utils'

/**
 * Default implementation for the SearchRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const searchRequestSchema = createTransformSchema<SearchRequest, PlatformSearchRequest>({
  transform: (source): PlatformSearchRequest =>
    defined<PlatformSearchRequest>({
      query: source.query,
      origin: source.origin,
      start: source.start,
      rows: source.rows,
      sort: source.sort,
      filter: mapFilters(source.filters),
      extraParams: source.extraParams,
    }),
})
