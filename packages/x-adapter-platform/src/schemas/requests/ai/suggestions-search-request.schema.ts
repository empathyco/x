import type { AiSuggestionsSearchRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchRequest } from '../../../types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { mapFilters } from '../../../mappers/filter.utils'
import { defined } from '../../utils'

/**
 * Default implementation for the aiSuggestionsSearchRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const aiSuggestionsSearchRequestSchema = createTransformSchema<
  AiSuggestionsSearchRequest,
  PlatformAiSuggestionsSearchRequest
>({
  transform: ({ extraParams, filters, origin, queries, excludeOptions }) => {
    const { lang, instance, ...restExtraParams } = extraParams ?? {}

    return {
      context: {
        lang: (lang ?? '') as string,
        instance: (instance ?? '') as string,
        filters: {
          ...restExtraParams,
          ...(filters && { filters: mapFilters(filters) }),
          origin,
        },
      },
      ...defined<Pick<PlatformAiSuggestionsSearchRequest, 'queries' | 'excludeOptions'>>({
        queries,
        excludeOptions,
      }),
    }
  },
})
