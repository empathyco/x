import type { QuerySuggestionsResponse } from '@empathyco/x-types'
import type { PlatformListResponseSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { suggestionSchema } from '../models/suggestion.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the QuerySuggestionsResponseSchema.
 *
 * @public
 */
export const querySuggestionsResponseSchema = createMutableZodSchema<
  PlatformListResponseSource<'topTrends', 'content'>,
  QuerySuggestionsResponse
>({
  transform: (source, context): QuerySuggestionsResponse =>
    defined<QuerySuggestionsResponse>({
      suggestions: parseEach(suggestionSchema, source.topTrends?.content, context),
    }),
})
