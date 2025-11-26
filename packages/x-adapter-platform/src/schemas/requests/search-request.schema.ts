import type { SearchRequest } from '@empathyco/x-types'
import type { PlatformSearchRequest } from '../../types/requests/search-request.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { mapFilters } from '../../mappers/filter.utils'

/**
 * Default implementation for the SearchRequestSchema.
 *
 * @public
 */
export const searchRequestSchema = createMutableSchema<SearchRequest, PlatformSearchRequest>({
  query: 'query',
  origin: 'origin',
  start: 'start',
  rows: 'rows',
  sort: 'sort',
  filter: ({ filters }) => mapFilters(filters),
  extraParams: ({ extraParams: { separateFacets, ...rest } = {} }) => ({
    ...rest,
    facets: !separateFacets,
  }),
})
