import type { RecommendationsResponse } from '@empathyco/x-types'
import type { PlatformListResponseSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { resultSchema } from '../models/result.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the RecommendationsResponseSchema.
 *
 * @public
 */
export const recommendationsResponseSchema = createMutableZodSchema<
  PlatformListResponseSource<'topclicked', 'content'>,
  RecommendationsResponse
>({
  transform: (source, context): RecommendationsResponse =>
    defined<RecommendationsResponse>({
      results: parseEach(resultSchema, source.topclicked?.content, context),
    }),
})
