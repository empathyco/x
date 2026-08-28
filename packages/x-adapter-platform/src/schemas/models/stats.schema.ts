import type { Stats } from '@empathyco/x-types'
import { z } from 'zod'

/**
 * Default implementation for the Stats schema.
 *
 * @public
 */
export const statsSchema = z
  .object({
    price: z
      .object({
        min: z.unknown().optional(),
        max: z.unknown().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): Stats => ({
      price: {
        min: source.price?.min ? Number(source.price.min) : undefined,
        max: source.price?.max ? Number(source.price.max) : undefined,
      },
    }),
  )
