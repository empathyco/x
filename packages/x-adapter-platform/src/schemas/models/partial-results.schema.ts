import type { PartialResult } from '@empathyco/x-types'
import type { PlatformPartialResult } from '../../types/models/partials.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { resultSchema } from './result.schema'

/**
 * Default implementation for the PartialResultsSchema.
 *
 * @public
 */
export const partialResultsSchema = createMutableSchema<PlatformPartialResult, PartialResult>({
  query: 'term',
  results: {
    $path: 'content',
    $subSchema: resultSchema,
  },
  totalResults: 'numFound',
})
