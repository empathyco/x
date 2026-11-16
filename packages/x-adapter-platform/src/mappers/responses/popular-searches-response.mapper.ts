import type { PopularSearchesResponse } from '@empathyco/x-types'
import type { PlatformPopularSearchesResponse } from '../../types/responses/popular-searches-response.model'

import { zSchemaMapperFactory } from '@empathyco/x-adapter'

import { popularSearchesResponseSchema } from '../../schemas/responses/popular-searches-response.schema'

/**
 * Default implementation for the PopularSearchesResponseMapper.
 *
 * @public
 */
export const popularSearchesResponseMapper = zSchemaMapperFactory<
  PlatformPopularSearchesResponse,
  PopularSearchesResponse
>(popularSearchesResponseSchema)
