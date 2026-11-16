import type { Stats } from '@empathyco/x-types'
import type { PlatformStatsSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the StatsSchema.
 *
 * @public
 */
export const statsSchema = createTransformSchema<PlatformStatsSource, Stats>({
  transform: ({ price }): Stats => ({
    price: {
      min: price?.min ? Number(price.min) : undefined,
      max: price?.max ? Number(price.max) : undefined,
    },
  }),
})
