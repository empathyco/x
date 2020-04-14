import { Store } from 'vuex';
import { reduce } from '../../utils/object';
import { Dictionary } from '../../utils/types';
import { ExtractGetters, XModuleName } from '../../x-modules/x-modules.types';
import { AnyXStoreModule, RootXStoreState } from '../store.types';

/**
 * Creates a proxy object of the getters of the storeModule passed.
 *
 * @param store - The Vuex Store.
 * @param moduleName - The name of the module.
 * @param storeModule - The store module.
 * @returns A {@link GettersTree} object with only the getters of the {@link XModule}.
 *
 * @internal
 *
 * @remarks This proxy will be used by the stateSelector, of the module. This is done to ensure that
 * a Vuex stateSelector can only access the getters of the {@link XModule} where it is registered.
 */
export function getGettersProxyFromModule<ModuleName extends XModuleName>(
  store: Store<RootXStoreState>,
  moduleName: ModuleName,
  storeModule: AnyXStoreModule
): ExtractGetters<ModuleName> {
  const modulePath = `x/${moduleName}/`;
  return reduce(
    storeModule.getters as Dictionary,
    (safeGettersProxy, getterName) =>
      defineGetterProxy(safeGettersProxy, getterName, `${modulePath}${getterName}`, store),
    {} as ExtractGetters<ModuleName>
  );
}

/**
 * Creates a proxy object of the getters of the module with the moduleName passed.
 *
 * @param store - The Vuex Store.
 * @param moduleName - The name of the module.
 * @returns A {@link GettersTree} object with only the getters of the {@link XModule}.
 *
 * @internal
 *
 * @remarks This proxy will be used by the stateSelector, of the module. This is done to ensure that
 * a Vuex stateSelector can only access the getters of the {@link XModule} where it is registered.
 */
export function getGettersProxyFromStore<ModuleName extends XModuleName>(
  store: Store<RootXStoreState>,
  moduleName: ModuleName
): ExtractGetters<ModuleName> {
  const modulePath = `x/${moduleName}/`;
  const getterKeys: string[] = Object.keys(store.getters).filter(getterKey =>
    getterKey.startsWith(modulePath)
  );
  return getterKeys.reduce((safeGettersProxy, fullPathGetterName) => {
    const getterName = fullPathGetterName.replace(modulePath, '');
    return defineGetterProxy(safeGettersProxy, getterName, fullPathGetterName, store);
  }, {} as ExtractGetters<ModuleName>);
}

/**
 * Defines a JS getter in safeGettersProxy object that returns the Vuex getter value.
 *
 * @param safeGettersProxy - The object where the proxy will be defined.
 * @param getterName - The name of the Getter without path. For example: 'trimQuery'.
 * @param fullPathGetterName - The name of the getter to be accessed with the full path.
 * For example: 'x/searchBox/trimmedQuery'.
 * @param store - The Vuex Store.
 * @returns The same safeGetterProxy with new get defined.
 *
 * @internal
 */
function defineGetterProxy<ModuleName extends XModuleName>(
  safeGettersProxy: ExtractGetters<ModuleName>,
  getterName: string,
  fullPathGetterName: string,
  store: Store<RootXStoreState>
): ExtractGetters<ModuleName> {
  return Object.defineProperty(safeGettersProxy, getterName, {
    get() {
      return store.getters[fullPathGetterName];
    },
    enumerable: true
  });
}
