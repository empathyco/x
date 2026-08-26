import type { PopularSearchesRequest } from '@empathyco/x-types'
import type { PlatformPopularSearchesRequest } from '../../types/requests/popular-searches-request.model'
import { zSchemaMapperFactory } from '@empathyco/x-adapter'
import { popularSearchesRequestSchema } from '../../schemas/requests/popular-searches-request.schema'

/**
 * Default implementation for the PopularSearchesRequestMapper.
 *
 * @public
 */
export const popularSearchesRequestMapper = zSchemaMapperFactory<
  PopularSearchesRequest,
  PlatformPopularSearchesRequest
>(popularSearchesRequestSchema)
