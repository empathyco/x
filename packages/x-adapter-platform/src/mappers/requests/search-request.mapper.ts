import type { SearchRequest } from '@empathyco/x-types'
import type { PlatformSearchRequest } from '../../types/requests/search-request.model'
import { transformSchemaMapperFactory } from '@empathyco/x-adapter'
import { searchRequestSchema } from '../../schemas/requests/search-request.schema'

/**
 * Default implementation for the SearchRequestMapper.
 *
 * @public
 */
export const searchRequestMapper = transformSchemaMapperFactory<
  SearchRequest,
  PlatformSearchRequest
>(searchRequestSchema)
