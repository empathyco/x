import type { BrowseRequest } from '@empathyco/x-types'
import type { PlatformBrowseRequest } from '../../types/requests/browse-request.model'
import { transformSchemaMapperFactory } from '@empathyco/x-adapter'
import { browseRequestSchema } from '../../schemas/requests/browse-request.schema'

/**
 * Default implementation for the BrowseRequestMapper.
 *
 * @public
 */
export const browseRequestMapper = transformSchemaMapperFactory<
  BrowseRequest,
  PlatformBrowseRequest
>(browseRequestSchema)
