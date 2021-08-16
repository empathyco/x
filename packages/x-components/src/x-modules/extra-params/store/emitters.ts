import { createStoreEmitters } from '../../../store';
import { extraParamsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the URL module.
 *
 * @internal
 */
export const extraParamsEmitters = createStoreEmitters(extraParamsXStoreModule, {});
