import type { BrowseRequest } from '@empathyco/x-types'
import type { PlatformBrowseRequest } from '../../types/requests/browse-request.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { mapFilters } from '../../mappers/filter.utils'

/**
 * Default implementation for the BrowseRequestSchema.
 *
 * @public
 */
export const browseRequestSchema = createMutableSchema<BrowseRequest, PlatformBrowseRequest>({
  browseField: 'browseField',
  browseValue: 'browseValue',
  origin: 'origin',
  start: 'start',
  rows: 'rows',
  sort: 'sort',
  filter: ({ filters }) => mapFilters(filters),
  extraParams: 'extraParams',
})
