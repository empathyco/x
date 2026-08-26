import type { QuerySuggestionsResponse } from '@empathyco/x-types'
import type { PlatformQuerySuggestionsResponse } from '../../types/responses/query-suggestions-response.model'
import { createContextualMapperFactory } from '@empathyco/x-adapter'
import { z } from 'zod'
import { suggestionSchema } from '../models/suggestion.schema'

/**
 * Default implementation for the QuerySuggestionsResponseSchema.
 *
 * @public
 */
export const querySuggestionsResponseSchema = createContextualMapperFactory<
  PlatformQuerySuggestionsResponse,
  QuerySuggestionsResponse
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
      (source): QuerySuggestionsResponse => ({
        suggestions:
          source.topTrends?.content?.map(item => suggestionSchema(context).parse(item)) ?? [],
      }),
    ),
)
