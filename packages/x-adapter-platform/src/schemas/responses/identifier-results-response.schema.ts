import type { IdentifierResultsResponse } from '@empathyco/x-types'
import type { PlatformListResponseSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { resultSchema } from '../models/result.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the IdentifierResultsResponseSchema.
 *
 * @public
 */
export const identifierResultsResponseSchema = createMutableZodSchema<
  PlatformListResponseSource<'catalog', 'content'>,
  IdentifierResultsResponse
>({
  transform: (source, context): IdentifierResultsResponse =>
    defined<IdentifierResultsResponse>({
      results: parseEach(resultSchema, source.catalog?.content, context),
    }),
})
