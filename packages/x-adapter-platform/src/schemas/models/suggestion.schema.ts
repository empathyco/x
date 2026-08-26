import type { MapperContext } from '@empathyco/x-adapter'
import type { Suggestion } from '@empathyco/x-types'
import { z } from 'zod'

/**
 * Returns a Zod schema for mapping a PlatformSuggestion to a Suggestion.
 * The schema depends on the MapperContext to determine the modelName.
 *
 * @public
 */
export function suggestionSchema(context: MapperContext) {
  return z
    .object({
      title_raw: z.string().optional(),
      keywords: z.string().optional(),
    })
    .passthrough()
    .transform(
      (source): Suggestion => ({
        query: source.title_raw ?? source.keywords ?? '',
        key: source.title_raw ?? source.keywords ?? '',
        modelName: context.requestParameters?.query ? 'QuerySuggestion' : 'PopularSearch',
        facets: [],
        isCurated: false,
      }),
    )
}
