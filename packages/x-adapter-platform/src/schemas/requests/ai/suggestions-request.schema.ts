import type { PlatformAiSuggestionsRequest } from '../../../types'
import { z } from 'zod'
import { mapFilters } from '../../../mappers/filter.utils'

/**
 * Default implementation for the aiSuggestionsRequestSchema.
 *
 * @public
 */
export const aiSuggestionsRequestSchema = z
  .object({
    query: z.string().optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
    filters: z.record(z.string(), z.array(z.any())).optional(),
    origin: z.string().optional(),
  })
  .passthrough()
  .transform((source): PlatformAiSuggestionsRequest => {
    const { lang, instance, ...restExtraParams } = source.extraParams ?? {}
    return {
      context: {
        query: source.query,
        lang: (lang ?? '') as string,
        instance: (instance ?? '') as string,
        filters: {
          ...restExtraParams,
          ...(source.filters && { filters: mapFilters(source.filters) }),
          origin: source.origin,
        },
      },
    }
  })
