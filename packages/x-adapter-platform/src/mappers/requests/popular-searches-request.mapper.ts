import type { PopularSearchesRequest } from '@empathyco/x-types'
import type { PlatformPopularSearchesRequest } from '../../types/requests/popular-searches-request.model'

import { transformSchemaMapperFactory } from '@empathyco/x-adapter'

import { popularSearchesRequestSchema } from '../../schemas/requests/popular-searches-request.schema'

/**
 * Default implementation for the PopularSearchesRequestMapper.
 *
 * @public
 */
export const popularSearchesRequestMapper = transformSchemaMapperFactory<
  PopularSearchesRequest,
  PlatformPopularSearchesRequest
>(popularSearchesRequestSchema)
