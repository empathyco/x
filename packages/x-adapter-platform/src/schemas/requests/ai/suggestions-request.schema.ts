import type { AiSuggestionsRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the aiSuggestionsRequestSchema.
 *
 * @public
 */
export const aiSuggestionsRequestSchema = createMutableSchema<
  AiSuggestionsRequest,
  PlatformAiSuggestionsRequest
>({
  context: ({ query, extraParams }) => ({
    query,
    lang: extraParams?.lang as string,
    instance: extraParams?.instance as string,
    filters: extraParams?.filters as Record<string, unknown> | undefined,
  }),
})
