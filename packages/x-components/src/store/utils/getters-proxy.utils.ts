import { reduce } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { Dictionary } from '../../utils/types';
import { ExtractGetters, XModuleName } from '../../x-modules/x-modules.types';
import { AnyXStoreModule } from '../store.types';

type Getters = { [ModuleName in XModuleName]?: ExtractGetters<ModuleName> };
let cache: Getters = {};
/**
 * Creates or return a proxy object of the getters of the storeModule passed.
 *
 * @param getters - The Vuex Store Getters.
 * @param moduleName - The name of the module.
 * @param storeModule - The store module.
 * @returns A {@link GettersTree} object with only the getters of the {@link XModule}.
 *
 * @internal
 *
 * @remarks This proxy will be used by the stateSelector, of the module. This is done to ensure that
 * a Vuex stateSelector can only access the getters of the {@link XModule} where it is registered.
 * This function task can be done with {@link getGettersProxy}, just without passing the
 * storeModule. But in that case every time we register emitters in a module, it will loop over all
 * the getters of all the store. This way, passing the moduleNeeded, it only loops over the getters
 * of that module. It is a performance question to have this two different implementations.
 *
 */
export function getGettersProxyFromModule<ModuleName extends XModuleName>(
  getters: Pick<Store<any>, 'getters'>,
  moduleName: ModuleName,
  storeModule: AnyXStoreModule
): ExtractGetters<ModuleName> {
  /* TODO: Review why TS is not able to exclude undefined types from the Getters cache */
  const cachedGetter = cache[moduleName];
  if (isCacheGetterDefined<ModuleName>(cachedGetter)) {
    return cachedGetter;
  }
  const modulePath = `x/${moduleName}/`;
  const safeGetters = reduce(
    storeModule.getters as Dictionary,
    (safeGettersProxy, getterName) =>
      defineGetterProxy(safeGettersProxy, getterName, `${modulePath}${getterName}`, getters),
    {} as ExtractGetters<ModuleName>
  );
  cache[moduleName] = safeGetters as unknown as Getters[ModuleName];
  return safeGetters;
}

/**
 * Creates or return a proxy object of the getters of the module with the moduleName passed.
 *
 * @param getters - The Vuex Store Getters.
 * @param moduleName - The name of the module.
 * @returns A {@link GettersTree} object with only the getters of the {@link XModule}.
 *
 * @internal
 *
 * @remarks This proxy will be used wireCommit to pass the module state and getters, to a function
 * that will return the payload to commit the mutation.
 */
export function getGettersProxy<ModuleName extends XModuleName>(
  getters: Pick<Store<any>, 'getters'>,
  moduleName: ModuleName
): ExtractGetters<ModuleName> {
  /* TODO: Review why TS is not able to exclude undefined types from the Getters cache */
  const cachedGetter = cache[moduleName];
  if (isCacheGetterDefined<ModuleName>(cachedGetter)) {
    return cachedGetter;
  }
  const modulePath = `x/${moduleName}/`;
  const getterKeys: string[] = Object.keys(getters).filter(getterKey =>
    getterKey.startsWith(modulePath)
  );
  const safeGetters = getterKeys.reduce((safeGettersProxy, fullPathGetterName) => {
    const getterName = fullPathGetterName.replace(modulePath, '');
    return defineGetterProxy(safeGettersProxy, getterName, fullPathGetterName, getters);
  }, {} as ExtractGetters<ModuleName>);
  cache[moduleName] = safeGetters as unknown as Getters[ModuleName];
  return safeGetters;
}

/**
 * Defines a JS getter in safeGettersProxy object that returns the Vuex getter value.
 *
 * @param safeGettersProxy - The object where the proxy will be defined.
 * @param getterName - The name of the Getter without path. For example: 'trimQuery'.
 * @param fullPathGetterName - The name of the getter to be accessed with the full path.
 * For example: 'x/searchBox/trimmedQuery'.
 * @param getters - The Vuex Store Getters.
 * @returns The same safeGetterProxy with new get defined.
 *
 * @internal
 */
function defineGetterProxy<ModuleName extends XModuleName>(
  safeGettersProxy: ExtractGetters<ModuleName>,
  getterName: string,
  fullPathGetterName: string,
  getters: Dictionary
): ExtractGetters<ModuleName> {
  return Object.defineProperty(safeGettersProxy, getterName, {
    get() {
      return getters[fullPathGetterName];
    },
    enumerable: true
  });
}

/** Clean the cache (This is for testing purpose).
 *
 * @internal
 * */
export function cleanGettersProxyCache(): void {
  cache = {};
}

/**
 * Checks if the getter cached is defined.
 *
 * @param cachedGetter - The getter cached.
 * @returns If the getters is defined or not.
 *
 * @internal
 */
function isCacheGetterDefined<ModuleName extends XModuleName>(
  cachedGetter: ExtractGetters<ModuleName> | undefined | unknown
): cachedGetter is ExtractGetters<ModuleName> {
  return cachedGetter !== undefined;
}
