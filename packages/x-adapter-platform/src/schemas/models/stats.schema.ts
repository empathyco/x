import type { Stats } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'

const value = z.optional(z.union([z.number(), z.string()]))

/**
 * Default implementation for the StatsSchema.
 *
 * @public
 */
export const statsSchema = createMutableZodSchema({
  source: z.looseObject({
    price: z.optional(z.looseObject({ min: value, max: value })),
  }),
  transform: ({ price }): Stats => ({
    price: {
      min: price?.min ? Number(price.min) : undefined,
      max: price?.max ? Number(price.max) : undefined,
    },
  }),
})
