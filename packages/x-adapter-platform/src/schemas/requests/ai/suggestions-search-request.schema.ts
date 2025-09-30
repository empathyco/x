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
  context: ({ extraParams }) => {
    const { lang, instance, ...restExtraParams } = extraParams ?? {}

    return {
      lang: (lang as string | undefined) ?? '',
      instance: (instance as string | undefined) ?? '',
      filters: restExtraParams,
    }
  },
  queries: 'queries',
})
