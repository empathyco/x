import type { PlatformAiSuggestionsSearchRequest } from '../../../types'
import { z } from 'zod'
import { mapFilters } from '../../../mappers/filter.utils'

/**
 * Default implementation for the AiOverviewSuggestionsSearchRequestSchema.
 *
 * @public
 */
export const aiSuggestionsSearchRequestSchema = z
  .object({
    queries: z.array(z.any()).optional(),
    excludeOptions: z.record(z.string(), z.array(z.string())).optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
    filters: z.record(z.string(), z.array(z.any())).optional(),
    origin: z.string().optional(),
  })
  .passthrough()
  .transform((source): PlatformAiSuggestionsSearchRequest => {
    const { lang, instance, ...restExtraParams } = source.extraParams ?? {}
    return {
      context: {
        lang: (lang ?? '') as string,
        instance: (instance ?? '') as string,
        filters: {
          ...restExtraParams,
          ...(source.filters && { filters: mapFilters(source.filters) }),
          origin: source.origin,
        },
      },
      queries: (source.queries ?? []) as { query: string; categories: string[] }[],
      excludeOptions: (source.excludeOptions ?? { resultIds: [] }) as {
        resultIds: (string | number)[]
      },
    }
  })
