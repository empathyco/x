import { StoreEmitters } from './store-emitters.types';
import { AnyXStoreModule } from './store.types';

/**
 * Helper function for creating type-safe {@link StoreEmitters}.
 *
 * @param storeModule - The store module that the emitters will be associated to
 * @param emitters - The {@link StoreEmitters} to create
 * @public
 */
export function createStoreEmitters<
  Module extends AnyXStoreModule,
  Emitters extends StoreEmitters<Module>
>(storeModule: Module, emitters: Emitters): Emitters {
  return emitters;
}
