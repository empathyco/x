import { createMutableSchema } from '@empathyco/x-adapter';
import { Stats } from '@empathyco/x-types';
import { PlatformStats } from '../../types/models/stats.model';

/**
 * Default implementation for the Stats schema.
 *
 * @public
 */
export const statsSchema = createMutableSchema<PlatformStats, Stats>({
  price: {
    min: ({ price }) => Number(price.min),
    max: ({ price }) => Number(price.max)
  }
});
