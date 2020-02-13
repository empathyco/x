import { StoreEmitters } from './store-emitters.types';
import { AnyXStoreModule } from './store.types';

/**
 * Helper function for creating type-safe {@link StoreEmitters}.
 * @param storeModule The store module that the emitters will be associated to
 * @param emitters The {@link StoreEmitters} to create
 */
export function createStoreEmitters<S extends AnyXStoreModule, E extends StoreEmitters<S>>(
  storeModule: S,
  emitters: E
): E {
  return emitters;
}
