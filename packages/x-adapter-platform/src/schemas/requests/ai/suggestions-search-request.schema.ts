import type { AiSuggestionsSearchRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the AiOverviewSuggestionsSearchRequestSchema.
 *
 * @public
 */
export const aiSuggestionsSearchRequestSchema = createMutableSchema<
  AiSuggestionsSearchRequest,
  PlatformAiSuggestionsSearchRequest
>({
  context: ({ lang, extraParams }): PlatformAiSuggestionsSearchRequest['context'] => {
    const context: PlatformAiSuggestionsSearchRequest['context'] = { lang }
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
