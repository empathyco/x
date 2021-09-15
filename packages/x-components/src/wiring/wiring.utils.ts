import { Store } from 'vuex';
import { RootXStoreState, StoreModuleStateAndGetters } from '../store/store.types';
import { getGettersProxy } from '../store/utils/get-getters-proxy';
import { ExtractState, XModuleName } from '../x-modules/x-modules.types';
import { Wiring } from './wiring.types';

/**
 * Util function to generate type-safe wiring.
 * If TypeScript ever accepts the PR about generic type inference this function can be removed.
 *
 * @param wiring - The wiring to create.
 * @returns Type-safe wiring.
 *
 * @public
 */
export function createWiring<T extends Partial<Wiring>>(wiring: T): T {
  return wiring;
}

/**
 * Returns an object with the getters and state of a module of store defined by the moduleName
 * parameter.
 *
 * @param state - The Vuex store State.
 * @param getters - The Vuex store Getters.
 * @param moduleName - The {@link XModuleName} of the module.
 * @returns The {@link StoreModuleStateAndGetters} with the Getters and the State of the
 * {@link XStoreModule | Store Module} defined by moduleName.
 *
 * @public
 */
export function getStateAndGettersFromModule<ModuleName extends XModuleName>(
  state: RootXStoreState,
  getters: Pick<Store<any>, 'getters'>,
  moduleName: ModuleName
): StoreModuleStateAndGetters<ModuleName> {
  return {
    state: state.x[moduleName] as unknown as ExtractState<ModuleName>,
    getters: getGettersProxy(getters, moduleName)
  };
}
