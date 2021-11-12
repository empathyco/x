import { createStoreEmitters } from '../../../store';
import { scrollXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the scroll module.
 *
 * @internal
 */
export const scrollEmitters = createStoreEmitters(scrollXStoreModule, {});
