import { createStoreEmitters } from '../../../store';
import { taggingXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the tagging module.
 *
 * @internal
 */
export const taggingEmitters = createStoreEmitters(taggingXStoreModule, {});
