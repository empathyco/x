import type { BrowseResponse } from '@empathyco/x-types'
import type { PlatformBrowseResponse } from '../../types/responses/browse-response.model'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { browseResponseSchema } from '../../schemas/responses/browse-response.schema'

/**
 * Default implementation for the BrowseResponseMapper.
 *
 * @public
 */
export const browseResponseMapper = schemaMapperFactory<PlatformBrowseResponse, BrowseResponse>(
  browseResponseSchema,
)
