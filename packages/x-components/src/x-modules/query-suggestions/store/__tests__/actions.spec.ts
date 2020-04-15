import { SuggestionsResponse } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';
import { deepMerge } from '@empathybroker/deep-merge';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchAdapterDummy } from '../../../../plugins/__tests__/adapter.dummy';
import { DeepPartial, map } from '../../../../utils';
import { querySuggestionsXStoreModule } from '../module';
import { QuerySuggestionsState } from '../types';
import Mock = jest.Mock;

describe('testing history queries module actions', () => {
  const mockedSuggestions: Suggestion[] = [
    {
      facets: [],
      query: 'salt',
      key: 'salt',
      modelName: 'QuerySuggestion'
    },
    {
      facets: [],
      query: 'limes',
      key: 'limes',
      modelName: 'QuerySuggestion'
    },

    {
      facets: [],
      query: 'beef short ribs',
      key: 'beef short ribs',
      modelName: 'QuerySuggestion'
    }
  ];

  const adapter = Object.assign(SearchAdapterDummy, {
    getSuggestions: getMockedAdapterFunction<SuggestionsResponse>({
      suggestions: mockedSuggestions
    })
  });

  const actionKeys = map(querySuggestionsXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  let store: Store<QuerySuggestionsState> = new Store(querySuggestionsXStoreModule as any);
  localVue.use(XPlugin, { adapter, store });

  /**
   * Reset the state with custom values.
   *
   * @param state - The state.
   */
  function resetStateWith(state: DeepPartial<QuerySuggestionsState>): void {
    const newState: QuerySuggestionsState = deepMerge(querySuggestionsXStoreModule.state(), state);
    store.replaceState(newState);
  }

  /**
   * Mocks an adapter function.
   *
   * @param whatReturns - The returned response object.
   * @returns Mocked promise.
   */
  function getMockedAdapterFunction<T = any>(whatReturns: T): Mock<Promise<T>> {
    return jest.fn(() => new Promise(resolve => setTimeout(() => resolve(whatReturns))));
  }

  beforeEach(() => {
    resetStateWith({ query: '' });
  });

  describe(`${actionKeys.getSuggestions}`, () => {
    it('should return suggestions if there is request', async () => {
      resetStateWith({
        query: 'luichito'
      });

      const suggestions = await store.dispatch(actionKeys.getSuggestions);
      expect(suggestions).toEqual(mockedSuggestions);
    });

    it('should return empty array if there is not request', async () => {
      const suggestions = await store.dispatch(actionKeys.getSuggestions);
      expect(suggestions).toEqual([]);
    });
  });

  describe(`${actionKeys.getAndSaveSuggestions}`, () => {
    it('should request and store suggestions in the state', async () => {
      resetStateWith({
        query: 'luichito'
      });
      await store.dispatch(actionKeys.getAndSaveSuggestions);
      expect(store.state.suggestions).toEqual(mockedSuggestions);
    });

    it('should clear suggestions in the state if the query is empty', async () => {
      await store.dispatch(actionKeys.getAndSaveSuggestions);
      expect(store.state.suggestions).toEqual([]);
    });
  });
});
