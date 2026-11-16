import type { PartialResult } from '@empathyco/x-types'
import type { PlatformPartialResultSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { defined, parseEach } from '../utils'
import { resultSchema } from './result.schema'

/**
 * Default implementation for the PartialResultsSchema.
 *
 * @public
 */
export const partialResultsSchema = createTransformSchema<
  PlatformPartialResultSource,
  PartialResult
>({
  transform: (source, context): PartialResult =>
    defined<PartialResult>({
      query: source.term,
      results: parseEach(resultSchema, source.content, context),
      totalResults: source.numFound,
    }),
})
