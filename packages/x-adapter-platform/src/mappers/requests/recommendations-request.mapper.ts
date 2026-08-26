import type { RecommendationsRequest } from '@empathyco/x-types'
import type { PlatformRecommendationsRequest } from '../../types/requests/recommendations-request.model'
import { zSchemaMapperFactory } from '@empathyco/x-adapter'
import { recommendationsRequestSchema } from '../../schemas/requests/recommendations-request.schema'

/**
 * Default implementation for the RecommendationsRequestMapper.
 *
 * @public
 */
export const recommendationsRequestMapper = zSchemaMapperFactory<
  RecommendationsRequest,
  PlatformRecommendationsRequest
>(recommendationsRequestSchema)
