import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types'
import { createMutableSchema, schemaMapperFactory } from '@empathyco/x-adapter'
import { resultSchema } from '../result.schema'

/**
 * Default implementation for the AIOverviewSuggestionsSearchSchema.
 *
 * @public
 */
export const aiSuggestionsSearchSchema = createMutableSchema<
  PlatformAiSuggestionsSearchResponse,
  AiSuggestionsSearchResponse
>({
  suggestions: ({ items }: PlatformAiSuggestionsSearchResponse) =>
    items.map(item => ({
      query: item.query,
      results: item.results.map(result => schemaMapperFactory(resultSchema)(result, {})),
    })),
})
