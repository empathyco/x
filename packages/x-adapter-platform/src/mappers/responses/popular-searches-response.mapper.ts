import type { PopularSearchesResponse } from '@empathyco/x-types'
import type { PlatformPopularSearchesResponse } from '../../types/responses/popular-searches-response.model'
import { popularSearchesResponseSchema } from '../../schemas/responses/popular-searches-response.schema'

/**
 * Default implementation for the PopularSearchesResponseMapper.
 *
 * @public
 */
export const popularSearchesResponseMapper = popularSearchesResponseSchema as (
  source: PlatformPopularSearchesResponse,
  context: Record<string, unknown>,
) => PopularSearchesResponse
