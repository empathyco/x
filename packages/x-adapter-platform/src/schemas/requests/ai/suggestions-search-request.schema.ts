import type { AiSuggestionsSearchRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'
import { mapFilters } from '../../../mappers/filter.utils'

/**
 * Default implementation for the AiOverviewSuggestionsSearchRequestSchema.
 *
 * @public
 */
export const aiSuggestionsSearchRequestSchema = createMutableSchema<
  AiSuggestionsSearchRequest,
  PlatformAiSuggestionsSearchRequest
>({
  context: ({ extraParams, filters, origin }) => {
    const { lang, instance, ...restExtraParams } = extraParams ?? {}

    return {
      lang: (lang ?? '') as string,
      instance: (instance ?? '') as string,
      filters: {
        ...restExtraParams,
        ...(filters && { filters: mapFilters(filters) }),
        origin,
      },
    }
  },
  queries: 'queries',
})
