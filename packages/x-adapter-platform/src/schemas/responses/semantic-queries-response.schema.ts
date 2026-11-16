import type { SemanticQueriesResponse } from '@empathyco/x-types'
import type { PlatformListResponseSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { semanticQuerySchema } from '../models/semantic-query.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the SemanticQueriesResponseSchema.
 *
 * @public
 */
export const semanticQueriesResponseSchema = createMutableZodSchema<
  PlatformListResponseSource<'data', 'candidates'>,
  SemanticQueriesResponse
>({
  transform: (source, context): SemanticQueriesResponse =>
    defined<SemanticQueriesResponse>({
      semanticQueries: parseEach(semanticQuerySchema, source.data?.candidates, context),
    }),
})
