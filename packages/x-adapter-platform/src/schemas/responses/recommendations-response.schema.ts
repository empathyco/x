import type { RecommendationsResponse } from '@empathyco/x-types'
import type { PlatformListResponseSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { resultSchema } from '../models/result.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the RecommendationsResponseSchema.
 *
 * @public
 */
export const recommendationsResponseSchema = createTransformSchema<
  PlatformListResponseSource<'topclicked', 'content'>,
  RecommendationsResponse
>({
  transform: (source, context): RecommendationsResponse =>
    defined<RecommendationsResponse>({
      results: parseEach(resultSchema, source.topclicked?.content, context),
    }),
})
