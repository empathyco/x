import { FeaturesResponseTypes, SearchAdapter } from '@empathyco/x-adapter';
import { deepMerge } from '@empathyco/x-deep-merge';
import { createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import { Store } from 'vuex';
import { XPluginOptions } from '../plugins';
import { BaseXBus } from '../plugins/x-bus';
import { XPlugin } from '../plugins/x-plugin';
import { ActionsDictionary } from '../store/actions.types';
import { MutationsDictionary } from '../store/mutations.types';
import { RootXStoreState, XStoreModule } from '../store/store.types';
import { cleanGettersProxyCache } from '../store/utils/get-getters-proxy';
import { DeepPartial, Dictionary } from '../utils/types';
import { ExtractState, XModule, XModuleName } from '../x-modules/x-modules.types';
import { SearchAdapterDummy } from './adapter.dummy';
import Mock = jest.Mock;

export type MockedSearchAdapter = {
  [Method in keyof Required<SearchAdapter>]: jest.Mock<
    ReturnType<Required<SearchAdapter>[Method]>,
    Parameters<Required<SearchAdapter>[Method]>
  >;
};

/**
 * Creates a selector for a dataTest property.
 *
 * @param dataTest - The value of the 'data-test' property.
 * @returns The selector for the given dataTest.
 *
 * @internal
 */
export function getDataTestSelector(dataTest: string): string {
  return `[data-test=${dataTest}]`;
}

/**
 * Reset store module state with the original module state and the new partial state passes as
 * parameter.
 *
 * @param store - The store where the state will be replaced.
 * @param moduleState - Original module store state.
 * @param newPartialState - The new partial state to be replaced.
 *
 * @internal
 */
export function resetStoreModuleState<ModuleState extends Dictionary>(
  store: Store<ModuleState>,
  moduleState: ModuleState,
  newPartialState?: DeepPartial<ModuleState>
): void {
  cleanGettersProxyCache();
  store.replaceState(mergeStates(moduleState, newPartialState));
}

/**
 * Reset store state of the X store module with the original module state and the partial state
 * pass as parameters.
 *
 * @param store - Root state of the x-modules.
 * @param moduleName - Module name which will be replaced the state.
 * @param moduleState - Original module store state.
 * @param newPartialState - The new partial state to be replaced.
 *
 * @internal
 */
export function resetStoreXModuleState<ModuleName extends XModuleName>(
  store: Store<DeepPartial<RootXStoreState>>,
  moduleName: ModuleName,
  moduleState: ExtractState<ModuleName>,
  newPartialState?: DeepPartial<ExtractState<ModuleName>>
): void {
  cleanGettersProxyCache();
  store.replaceState({
    x: {
      [moduleName]: mergeStates(moduleState, newPartialState)
    }
  });
}

/**
 * Mocks an adapter function.
 *
 * @param whatReturns - The returned response.
 * @returns Mocked promise.
 *
 * @internal
 */
export function getMockedAdapterFunction<T>(whatReturns: T): Mock<Promise<T>> {
  return jest.fn(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(whatReturns);
        });
      })
  );
}

/**
 * Mocks the {@link @empathyco/x-adapter#SearchAdapter | SearchAdapter} features with the
 * features responses passes as parameter. Features responses are not passes through the
 * parameter will resolve the promise as empty.
 *
 * @param responseFeatures - The features responses available to be mocked.
 * @returns The {@link @empathyco/x-adapter#SearchAdapter | SearchAdapter} with the features
 * mocked.
 *
 * @internal
 */
export function getMockedAdapter(
  responseFeatures?: Partial<Omit<FeaturesResponseTypes, 'track'>>
): MockedSearchAdapter {
  return {
    /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
    // Required functions
    getNextQueries: getMockedAdapterFunction(responseFeatures?.nextQueries!),
    getTopRecommendations: getMockedAdapterFunction(responseFeatures?.topRecommendations!),
    getSectionRecommendations: getMockedAdapterFunction(responseFeatures?.sectionRecommendations!),
    getQueriesRecommendations: getMockedAdapterFunction(responseFeatures?.queriesRecommendations!),
    getClicksRecommendations: getMockedAdapterFunction(responseFeatures?.clicksRecommendations!),
    getUserRecommendations: getMockedAdapterFunction(responseFeatures?.userRecommendations!),
    getRelatedTags: getMockedAdapterFunction(responseFeatures?.relatedTags!),
    getSuggestions: getMockedAdapterFunction(responseFeatures?.suggestions!),
    search: getMockedAdapterFunction(responseFeatures?.search!),
    searchById: getMockedAdapterFunction(responseFeatures?.searchById!),
    track: getMockedAdapterFunction(undefined),
    /* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */
    // Optional functions
    invalidateCache: jest.fn(),
    setConfig: jest.fn(),
    addConfigChangedListener: jest.fn(),
    removeConfigChangedListener: jest.fn()
  };
}

/**
 * Function to merge module state with a partial of the module state.
 *
 * @param moduleState - The original module state.
 * @param newPartialState - The new partial state to be replaced.
 *
 * @returns The new module state merged.
 */
function mergeStates<State extends Dictionary>(
  moduleState: State,
  newPartialState?: DeepPartial<State>
): State {
  return deepMerge({}, moduleState, newPartialState);
}

/**
 * Makes a clean install of the's the {@link XPlugin} into the passed Vue object.
 * This also resets the bus, and all the hardcoded dependencies of the XPlugin.
 *
 * @param options - The options for installing the {@link XPlugin}. The {@link SearchAdapterDummy}
 * is added by default.
 * @param localVue - A clone of the Vue constructor to isolate tests.
 * If not provided, one will be created.
 * @returns An array containing the `xPlugin` singleton and the `localVue` and objects.
 */
export function installNewXPlugin(
  options: Partial<XPluginOptions> = {},
  localVue: typeof Vue = createLocalVue()
): [XPlugin, typeof Vue] {
  const xPlugin = new XPlugin(new BaseXBus());
  const installOptions: XPluginOptions = { adapter: SearchAdapterDummy, ...options };
  localVue.use(xPlugin, installOptions);
  return [xPlugin, localVue];
}

/**
 * Helper function to create a type safe module without having to specify the types.
 *
 * @param xModule - The xModule definition to create.
 * @returns A type safe xModule.
 */
export function createXModule<
  State extends Record<keyof State, any>,
  Getters extends Record<keyof Getters, any>,
  Mutations extends MutationsDictionary<Mutations>,
  Actions extends ActionsDictionary<Actions>
>(
  xModule: XModule<XStoreModule<State, Getters, Mutations, Actions>>
): XModule<XStoreModule<State, Getters, Mutations, Actions>> {
  return xModule;
}
