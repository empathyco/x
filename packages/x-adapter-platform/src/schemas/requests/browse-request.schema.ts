import type { BrowseRequest } from '@empathyco/x-types'
import type { PlatformBrowseRequest } from '../../types/requests/browse-request.model'
import { createTransformSchema } from '@empathyco/x-adapter'
import { mapFilters } from '../../mappers/filter.utils'
import { defined } from '../utils'

/**
 * Default implementation for the BrowseRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const browseRequestSchema = createTransformSchema<BrowseRequest, PlatformBrowseRequest>({
  transform: (source): PlatformBrowseRequest =>
    defined<PlatformBrowseRequest>({
      browseField: source.browseField,
      browseValue: source.browseValue,
      origin: source.origin,
      start: source.start,
      rows: source.rows,
      sort: source.sort,
      filter: mapFilters(source.filters),
      extraParams: source.extraParams,
    }),
})
