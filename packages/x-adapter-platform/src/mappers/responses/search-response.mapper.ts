import type { SearchResponse } from '@empathyco/x-types'
import type { PlatformSearchResponse } from '../../types/responses/search-response.model'
import { zSchemaMapperFactory } from '@empathyco/x-adapter'
import { searchResponseSchema } from '../../schemas/responses/search-response.schema'

/**
 * Default implementation for the SearchResponseMapper.
 *
 * @public
 */
export const searchResponseMapper = zSchemaMapperFactory<PlatformSearchResponse, SearchResponse>(
  searchResponseSchema,
)
