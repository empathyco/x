import type { PopularSearchesResponse } from '@empathyco/x-types'
import type { PlatformPopularSearchesResponse } from '../../types/responses/popular-searches-response.model'
import { createContextualMapperFactory } from '@empathyco/x-adapter'
import { z } from 'zod'
import { suggestionSchema } from '../models/suggestion.schema'

/**
 * Default implementation for the PopularSearchesResponseSchema.
 *
 * @public
 */
export const popularSearchesResponseSchema = createContextualMapperFactory<
  PlatformPopularSearchesResponse,
  PopularSearchesResponse
>(context =>
  z
    .object({
      topTrends: z
        .object({
          content: z.array(z.any()).optional(),
        })
        .passthrough()
        .optional(),
    })
    .passthrough()
    .transform(
      (source): PopularSearchesResponse => ({
        suggestions:
          source.topTrends?.content?.map(item => suggestionSchema(context).parse(item)) ?? [],
      }),
    ),
)
