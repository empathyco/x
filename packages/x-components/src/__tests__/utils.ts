import type {
  AiQuestionsResponse,
  AiTasksResponse,
  ExperienceControlsResponse,
  IdentifierResultsResponse,
  NextQueriesResponse,
  PopularSearchesResponse,
  QuerySuggestionsResponse,
  RecommendationsResponse,
  RelatedPromptsResponse,
  RelatedTagsResponse,
  SearchResponse,
  SemanticQueriesResponse,
  XComponentsAdapter,
} from '@empathyco/x-types'
import type { AiSuggestionsSearchResponse } from '@empathyco/x-types/dist'
import type { DeepPartial, Dictionary } from '@empathyco/x-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { Store } from 'vuex'
import type { XPluginOptions } from '../plugins'
import type { ActionsDictionary } from '../store/actions.types'
import type { MutationsDictionary } from '../store/mutations.types'
import type { RootXStoreState, XStoreModule } from '../store/store.types'
import type { ExtractState, XModule, XModuleName } from '../x-modules/x-modules.types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { XPlugin } from '../plugins/x-plugin'
import { cleanGettersProxyCache } from '../store/utils/getters-proxy.utils'
import { XComponentsAdapterDummy } from './adapter.dummy'
import { XDummyBus } from './bus.dummy'
import Mock = jest.Mock

export type MockedXComponentsAdapter = {
  [Method in keyof Required<XComponentsAdapter>]: jest.Mock<
    ReturnType<Required<XComponentsAdapter>[Method]>,
    Parameters<Required<XComponentsAdapter>[Method]>
  >
}

/**
 * Interface containing the features responses that can be mocked.
 */
interface MockedAdapterFeatures {
  identifierResults: IdentifierResultsResponse
  nextQueries: NextQueriesResponse
  popularSearches: PopularSearchesResponse
  querySuggestions: QuerySuggestionsResponse
  recommendations: RecommendationsResponse
  relatedPrompts: RelatedPromptsResponse
  relatedTags: RelatedTagsResponse
  search: SearchResponse
  semanticQueries: SemanticQueriesResponse
  tagging: void
  experienceControls: ExperienceControlsResponse
  aiQuestions: AiQuestionsResponse
  aiTasks: AiTasksResponse
  aiSuggestions: Response
  aiSuggestionsSearch: AiSuggestionsSearchResponse
}

/**
 * Creates a selector for a dataTest property.
 *
 * @param dataTest - The value of the 'data-test' property.
 * @returns The selector for the given dataTest.
 *
 * @internal
 */
export function getDataTestSelector(dataTest: string): string {
  return `[data-test="${dataTest}"]`
}

/**
 * Searches for elements in a wrapper by data test id.
 *
 * @param wrapper - The wrapper to search in the data.
 * @param testDataId - The data test to search.
 *
 * @returns The wrappers matching the searched test data id.
 */
export function findTestDataById(wrapper: VueWrapper, testDataId: string) {
  return wrapper.findAll(getDataTestSelector(testDataId))
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
  newPartialState?: DeepPartial<ModuleState>,
): void {
  cleanGettersProxyCache()
  store.replaceState(mergeStates(moduleState, newPartialState))
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
  newPartialState?: DeepPartial<ExtractState<ModuleName>>,
): void {
  cleanGettersProxyCache()
  store.replaceState({
    x: {
      [moduleName]: mergeStates(moduleState, newPartialState),
    },
  })
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
    async () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(whatReturns)
        })
      }),
  )
}

/**
 * Mocks the {@link @empathyco/x-types#XComponentsAdapter | XComponentsAdapter} features with
 * the features responses passes as parameter. Features responses are not passed through the
 * parameter will resolve the promise as empty.
 *
 * @param responseFeatures - The features responses available to be mocked.
 * @returns The {@link @empathyco/x-types#XComponentsAdapter | XComponentsAdapter}
 * with the features mocked.
 *
 * @internal
 */
export function getMockedAdapter(
  responseFeatures?: Partial<MockedAdapterFeatures>,
): MockedXComponentsAdapter {
  return {
    /* eslint-disable ts/no-unsafe-assignment,ts/no-non-null-asserted-optional-chain */
    identifierResults: getMockedAdapterFunction(responseFeatures?.identifierResults!),
    nextQueries: getMockedAdapterFunction(responseFeatures?.nextQueries!),
    popularSearches: getMockedAdapterFunction(responseFeatures?.popularSearches!),
    querySuggestions: getMockedAdapterFunction(responseFeatures?.querySuggestions!),
    recommendations: getMockedAdapterFunction(responseFeatures?.recommendations!),
    relatedPrompts: getMockedAdapterFunction(responseFeatures?.relatedPrompts!),
    relatedTags: getMockedAdapterFunction(responseFeatures?.relatedTags!),
    search: getMockedAdapterFunction(responseFeatures?.search!),
    semanticQueries: getMockedAdapterFunction(responseFeatures?.semanticQueries!),
    tagging: getMockedAdapterFunction(undefined),
    experienceControls: getMockedAdapterFunction(responseFeatures?.experienceControls!),
    aiSuggestions: getMockedAdapterFunction(responseFeatures?.aiSuggestions),
    aiSuggestionsSearch: getMockedAdapterFunction(responseFeatures?.aiSuggestionsSearch),
    aiQuestions: getMockedAdapterFunction(responseFeatures?.aiQuestions!),
    aiTasks: getMockedAdapterFunction(responseFeatures?.aiTasks!),
    /* eslint-enable ts/no-unsafe-assignment,ts/no-non-null-asserted-optional-chain */
  }
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
  newPartialState?: DeepPartial<State>,
): State {
  return deepMerge({}, moduleState, newPartialState) as State
}

/**
 * Creates a new instance of the {@link XPlugin}. This also resets the bus.
 *
 * @param options - The options for installing the {@link XPlugin}. The
 * {@link XComponentsAdapterDummy}  is added by default.
 * @param bus - The event bus to use.
 * If not provided, one will be created.
 * @returns An array containing the `xPlugin` singleton and an object with
 * the plugin install options.
 */
export function installNewXPlugin(
  options: Partial<XPluginOptions> = {},
  bus = new XDummyBus(),
): [XPlugin, XPluginOptions] {
  XPlugin.resetInstance()
  const xPlugin = new XPlugin(bus)
  const installOptions: XPluginOptions = {
    adapter: XComponentsAdapterDummy,
    ...options,
  }
  return [xPlugin, installOptions]
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
  Actions extends ActionsDictionary<Actions>,
>(
  xModule: XModule<XStoreModule<State, Getters, Mutations, Actions>>,
): XModule<XStoreModule<State, Getters, Mutations, Actions>> {
  return xModule
}

/**
 * Mocks a `fetch` API call.
 *
 * @param response - The expected response resolved by calling `fetch()`.
 * @returns A Promise object.
 *
 * @internal
 */
export function getFetchMock(
  response: unknown,
): (url: string, params: RequestInit) => Promise<Response> {
  return async _url => {
    return new Promise<Response>(resolve => {
      setTimeout(() => {
        resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response),
          text: async () => Promise.resolve(JSON.stringify(response)),
        } as Response)
      })
    })
  }
}
