import { createStoreEmitters } from '../../../store';
import { facetsXStoreModule } from './module';
/**
 * {@link StoreEmitters} For the facets module.
 *
 * @internal
 */
export const facetsEmitters = createStoreEmitters(facetsXStoreModule, {});
