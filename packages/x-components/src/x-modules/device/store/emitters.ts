import { createStoreEmitters } from '../../../store';
import { deviceXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the device module.
 *
 * @internal
 */
export const deviceEmitters = createStoreEmitters(deviceXStoreModule, {});
