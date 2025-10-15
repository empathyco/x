import type { AiSuggestionsRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'
import { mapFilters } from '../../../mappers/filter.utils'

/**
 * Default implementation for the aiSuggestionsRequestSchema.
 *
 * @public
 */
export const aiSuggestionsRequestSchema = createMutableSchema<
  AiSuggestionsRequest,
  PlatformAiSuggestionsRequest
>({
  context: ({ query, extraParams, filters, origin }) => {
    const { lang, instance, ...restExtraParams } = extraParams ?? {}

    return {
      query,
      lang: (lang ?? '') as string,
      instance: (instance ?? '') as string,
      filters: {
        ...restExtraParams,
        ...(filters && { filters: mapFilters(filters) }),
        origin,
      },
    }
  },
})
