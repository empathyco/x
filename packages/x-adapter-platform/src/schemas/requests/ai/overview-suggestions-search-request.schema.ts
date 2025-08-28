import type { AiOverviewSuggestionsSearchRequest } from '@empathyco/x-types'
import type { PlatformAiOverviewSuggestionsSearchRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the AiOverviewSuggestionsSearchRequestSchema.
 *
 * @public
 */
export const aiOverviewSuggestionsSearchRequestSchema = createMutableSchema<
  AiOverviewSuggestionsSearchRequest,
  PlatformAiOverviewSuggestionsSearchRequest
>({
  context: ({ lang, extraParams }): PlatformAiOverviewSuggestionsSearchRequest['context'] => {
    const context: PlatformAiOverviewSuggestionsSearchRequest['context'] = { lang }
    if (extraParams && typeof extraParams === 'object') {
      if ('instance' in extraParams) {
        context.instance = (extraParams as { instance?: string }).instance
      }
      if ('filters' in extraParams) {
        context.filters = (extraParams as { filters?: Record<string, unknown> }).filters
      }
    }
    return context
  },
  queries: 'queries',
})
