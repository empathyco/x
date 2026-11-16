import type { IdentifierResultsResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { resultSchema } from '../models/result.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the IdentifierResultsResponseSchema.
 *
 * @public
 */
export const identifierResultsResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    catalog: z.optional(z.looseObject({ content: z.optional(z.array(z.unknown())) })),
  }),
  transform: (source, context): IdentifierResultsResponse =>
    defined<IdentifierResultsResponse>({
      results: parseEach(resultSchema, source.catalog?.content, context),
    }),
})
