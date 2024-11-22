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
    min: ({ price }) => (price?.min ? Number(price.min) : undefined),
    max: ({ price }) => (price?.max ? Number(price.max) : undefined)
  }
});
