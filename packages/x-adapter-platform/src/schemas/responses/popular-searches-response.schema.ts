import type { PopularSearchesResponse } from '@empathyco/x-types'
import type { PlatformListResponseSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { suggestionSchema } from '../models/suggestion.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the PopularSearchesResponseSchema.
 *
 * @public
 */
export const popularSearchesResponseSchema = createTransformSchema<
  PlatformListResponseSource<'topTrends', 'content'>,
  PopularSearchesResponse
>({
  transform: (source, context): PopularSearchesResponse =>
    defined<PopularSearchesResponse>({
      suggestions: parseEach(suggestionSchema, source.topTrends?.content, context),
    }),
})
