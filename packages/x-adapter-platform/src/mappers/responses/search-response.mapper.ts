import type { SearchResponse } from '@empathyco/x-types'
import type { PlatformSearchResponse } from '../../types/responses/search-response.model'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { searchResponseSchema } from '../../schemas/responses/search-response.schema'

/**
 * Default implementation for the SearchResponseMapper.
 *
 * @public
 */
export const searchResponseMapper = schemaMapperFactory<PlatformSearchResponse, SearchResponse>(
  searchResponseSchema,
)
