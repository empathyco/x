import { SuggestionsResponse } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchAdapterDummy } from '../../../../plugins/__tests__/adapter.dummy';
import { map } from '../../../../utils';
import { popularSearchesXStoreModule } from '../module';
import { PopularSearchesState } from '../types';
import Mock = jest.Mock;

describe('testing popular searches module actions', () => {
  const mockedSuggestions: Suggestion[] = [
    {
      facets: [],
      query: 'salt',
      key: 'salt',
      modelName: 'PopularSearches'
    },
    {
      facets: [],
      query: 'limes',
      key: 'limes',
      modelName: 'PopularSearches'
    },

    {
      facets: [],
      query: 'beef short ribs',
      key: 'beef short ribs',
      modelName: 'PopularSearches'
    }
  ];

  const adapter = Object.assign(SearchAdapterDummy, {
    getSuggestions: getMockedAdapterFunction<SuggestionsResponse>({
      suggestions: mockedSuggestions
    })
  });

  const actionKeys = map(popularSearchesXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  let store: Store<PopularSearchesState> = new Store(popularSearchesXStoreModule as any);
  localVue.use(XPlugin, { adapter, store });

  /**
   * Mocks an adapter function.
   *
   * @param whatReturns - The returned response object.
   * @returns Mocked promise.
   * @internal
   */
  function getMockedAdapterFunction<T = any>(whatReturns: T): Mock<Promise<T>> {
    return jest.fn(() => new Promise(resolve => setTimeout(() => resolve(whatReturns))));
  }

  describe(`${actionKeys.getSuggestions}`, () => {
    it('should return suggestions', async () => {
      const suggestions = await store.dispatch(actionKeys.getSuggestions);
      expect(suggestions).toEqual(mockedSuggestions);
    });
  });

  describe(`${actionKeys.getAndSaveSuggestions}`, () => {
    it('should request and store suggestions in the state', async () => {
      await store.dispatch(actionKeys.getAndSaveSuggestions);
      expect(store.state.popularSearches).toEqual(mockedSuggestions);
    });
  });
});
