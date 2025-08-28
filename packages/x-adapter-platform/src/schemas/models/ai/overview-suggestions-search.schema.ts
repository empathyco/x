import type { AiOverviewSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiOverviewSuggestionsSearchResponse } from '../../../types'
import { createMutableSchema, schemaMapperFactory } from '@empathyco/x-adapter'
import { resultSchema } from '../result.schema'

/**
 * Default implementation for the AIOverviewSuggestionsSearchSchema.
 *
 * @public
 */
export const aiOverviewSuggestionsSearchSchema = createMutableSchema<
  PlatformAiOverviewSuggestionsSearchResponse,
  AiOverviewSuggestionsSearchResponse
>({
  items: ({ items }: PlatformAiOverviewSuggestionsSearchResponse) =>
    items.map(item => ({
      query: item.query,
      results: item.results.map(result => schemaMapperFactory(resultSchema)(result, {})),
    })),
})
