import type { QuerySuggestionsResponse } from '@empathyco/x-types'
import type { PlatformQuerySuggestionsResponse } from '../../types/responses/query-suggestions-response.model'

import { createMutableSchema } from '@empathyco/x-adapter'
import { suggestionSchema } from '../models/suggestion.schema'

/**
 * Default implementation for the QuerySuggestionsResponseSchema.
 *
 * @public
 */
export const querySuggestionsResponseSchema = createMutableSchema<
  PlatformQuerySuggestionsResponse,
  QuerySuggestionsResponse
>({
  suggestions: {
    $path: 'topTrends.content',
    $subSchema: suggestionSchema,
  },
})
