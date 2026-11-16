import type { AiSuggestionsRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsRequest } from '../../../types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { mapFilters } from '../../../mappers/filter.utils'

/**
 * Default implementation for the aiSuggestionsRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const aiSuggestionsRequestSchema = createMutableZodSchema<
  AiSuggestionsRequest,
  PlatformAiSuggestionsRequest
>({
  transform: ({ query, extraParams, filters, origin }) => {
    const { lang, instance, ...restExtraParams } = extraParams ?? {}

    return {
      context: {
        query,
        lang: (lang ?? '') as string,
        instance: (instance ?? '') as string,
        filters: {
          ...restExtraParams,
          ...(filters && { filters: mapFilters(filters) }),
          origin,
        },
      },
    }
  },
})
