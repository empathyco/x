import type { IdentifierResultsResponse } from '@empathyco/x-types'
import { z } from 'zod'
import { resultSchema } from '../models/result.schema'

/**
 * Default implementation for the IdentifierResultsResponseSchema.
 *
 * @public
 */
export const identifierResultsResponseSchema = z
  .object({
    catalog: z
      .object({
        content: z.array(z.any()).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): IdentifierResultsResponse => ({
      results: source.catalog?.content?.map(item => resultSchema.parse(item)) ?? [],
    }),
  )
