import Mock = jest.Mock;
import {
  ClicksRecommendationsResponse,
  FeaturesResponseTypes,
  NextQueriesResponse,
  QueriesRecommendationsResponse,
  RelatedTagsResponse,
  SearchAdapter,
  SearchByIdResponse,
  SearchResponse,
  SectionRecommendationsResponse,
  SuggestionsResponse,
  TopRecommendationsResponse,
  UserRecommendationsResponse
} from '@empathy/search-adapter';
import { deepMerge } from '@empathybroker/deep-merge';
import { Store } from 'vuex';
import { RootXStoreState } from '../store/store.types';
import { DeepPartial, Dictionary } from '../utils/types';
import { ExtractState, XModuleName } from '../x-modules/x-modules.types';

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
  store.replaceState({
    x: {
      [moduleName]: mergeStates(moduleState, newPartialState)
    }
  });
}

/**
 * Mocks an adapter function.
 *
 * @param whatReturns - The returned response object or null to resolve with empty.
 * @returns Mocked promise.
 *
 * @internal
 */
export function getMockedAdapterFunction<T = any>(whatReturns: T | null): Mock<Promise<T>> {
  return jest.fn(
    () =>
      new Promise(resolve =>
        setTimeout(() => {
          return whatReturns ? resolve(whatReturns) : resolve();
        })
      )
  );
}

/**
 * Mocks the {@link @empathy/search-adapter#SearchAdapter | SearchAdapter} features with the
 * features responses passes as parameter. Features responses are not passes through the
 * parameter will resolve the promise as empty.
 *
 * @param responseFeatures - The features responses available to be mocked.
 * @returns The {@link @empathy/search-adapter#SearchAdapter | SearchAdapter} with the features
 * mocked.
 *
 * @internal
 */
export function getMockedAdapter(
  responseFeatures?: Partial<Omit<FeaturesResponseTypes, 'track'>>
): SearchAdapter {
  return {
    // Required functions
    getNextQueries: getMockedAdapterFunction<NextQueriesResponse>(
      responseFeatures?.nextQueries ?? null
    ),
    getTopRecommendations: getMockedAdapterFunction<TopRecommendationsResponse>(
      responseFeatures?.topRecommendations ?? null
    ),
    getSectionRecommendations: getMockedAdapterFunction<SectionRecommendationsResponse>(
      responseFeatures?.sectionRecommendations ?? null
    ),
    getQueriesRecommendations: getMockedAdapterFunction<QueriesRecommendationsResponse>(
      responseFeatures?.queriesRecommendations ?? null
    ),
    getClicksRecommendations: getMockedAdapterFunction<ClicksRecommendationsResponse>(
      responseFeatures?.clicksRecommendations ?? null
    ),
    getUserRecommendations: getMockedAdapterFunction<UserRecommendationsResponse>(
      responseFeatures?.userRecommendations ?? null
    ),
    getRelatedTags: getMockedAdapterFunction<RelatedTagsResponse>(
      responseFeatures?.relatedTags ?? null
    ),
    getSuggestions: getMockedAdapterFunction<SuggestionsResponse>(
      responseFeatures?.suggestions ?? null
    ),
    search: getMockedAdapterFunction<SearchResponse>(responseFeatures?.search ?? null),
    searchById: getMockedAdapterFunction<SearchByIdResponse>(responseFeatures?.searchById ?? null),
    track: getMockedAdapterFunction<void>(null),
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
function mergeStates<State extends Dictionary, ModuleName extends XModuleName>(
  moduleState: State,
  newPartialState?: DeepPartial<ExtractState<ModuleName>>
): State {
  return deepMerge({}, moduleState, newPartialState);
}

/**
 * Adds a mocked object to the localStorage.
 *
 * @param itemKey - String key of the item that will be added to the localStorage.
 * @param mockedItem - Mocked object to add to the localStorage.
 *
 * @internal
 */
export function setLocalStorageItem(itemKey: string, mockedItem: any): void {
  localStorage.setItem(itemKey, JSON.stringify(mockedItem));
}
