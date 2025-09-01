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
  context: ({ extraParams }) => ({
    lang: (extraParams?.lang as string | undefined) ?? '',
    instance: extraParams?.instance as string | undefined,
    filters: extraParams?.filters as Record<string, unknown> | undefined,
  }),
  queries: 'queries',
})
