import { createStoreEmitters } from '../../../store';
import { empathizeXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the empathize module.
 *
 * @internal
 */
export const empathizeEmitters = createStoreEmitters(empathizeXStoreModule, {});
