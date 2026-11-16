import type { RecommendationsRequest } from '@empathyco/x-types'
import type { PlatformRecommendationsRequest } from '../../types/requests/recommendations-request.model'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the RecommendationsRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const recommendationsRequestSchema = createMutableZodSchema<
  RecommendationsRequest,
  PlatformRecommendationsRequest
>({
  transform: (source): PlatformRecommendationsRequest =>
    defined<PlatformRecommendationsRequest>({
      start: source.start,
      rows: source.rows,
      origin: source.origin,
      extraParams: source.extraParams,
    }),
})
