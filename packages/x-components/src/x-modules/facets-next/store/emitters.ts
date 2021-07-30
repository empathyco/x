import { createStoreEmitters } from '../../../store/store.utils';
import { facetsNextXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the facets module.
 *
 * @internal
 */
export const facetsNextEmitters = createStoreEmitters(facetsNextXStoreModule, {});
