import type { AiSuggestionSearch } from '@empathyco/x-types'
import type { PlatformAiSuggestionSearchSource } from '../../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { defined, parseEach } from '../../utils'
import { resultSchema } from '../result.schema'

/**
 * Default implementation for the AiSuggestionSearchSchema.
 * @public
 */
export const aiSuggestionSearchSchema = createTransformSchema<
  PlatformAiSuggestionSearchSource,
  AiSuggestionSearch
>({
  transform: (source, context): AiSuggestionSearch =>
    defined<AiSuggestionSearch>({
      query: source.query,
      results: parseEach(resultSchema, source.results, context),
      numFound: source.numFound,
    }),
})
