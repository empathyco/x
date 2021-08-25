import { createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { createHistoryQueries } from '../../../../__stubs__/history-queries-stubs.factory';
import { getSuggestionsStub } from '../../../../__stubs__/suggestions-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { popularSearchesXStoreModule } from '../module';
import { PopularSearchesState } from '../types';
import { resetPopularSearchesStateWith } from './utils';
import { SuggestionsRequest } from '../../../../../../search-adapter/src/types/requests.types';

describe('testing popular searches module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(popularSearchesXStoreModule.getters, getter => getter);
  const store: Store<PopularSearchesState> = new Store(popularSearchesXStoreModule as any);

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object with config default values', () => {
      resetPopularSearchesStateWith(store, {
        config: { maxItemsToRequest: 3 },
        params: {
          catalog: 'es'
        }
      });
      expect(store.getters[gettersKeys.request]).toEqual<
        SuggestionsRequest & { [key: string]: unknown }
        // TODO - Remove when the facets refactor is completed.
      >({ rows: 3, start: 0, catalog: 'es' });
    });
  });

  describe(`${gettersKeys.popularSearches} getter`, () => {
    const searchedQueries = createHistoryQueries('limes');
    const mockedSuggestions = getSuggestionsStub('PopularSearch');

    const adapter = getMockedAdapter({ suggestions: { suggestions: mockedSuggestions } });
    const localVue = createLocalVue();
    localVue.config.productionTip = false; // Silent production console messages.
    localVue.use(Vuex);
    installNewXPlugin({ store, adapter }, localVue);

    it('should return the popular searches without the previously searched queries', () => {
      resetPopularSearchesStateWith(store, {
        searchedQueries,
        popularSearches: mockedSuggestions,
        config: {
          maxItemsToRequest: 5,
          hideSessionQueries: true
        }
      });
      expect(store.getters[gettersKeys.popularSearches]).toEqual(
        mockedSuggestions.filter(popularSearch => popularSearch.query !== 'limes')
      );
    });

    it('should return all popular searches if hideSessionQueries is false', () => {
      resetPopularSearchesStateWith(store, {
        searchedQueries,
        popularSearches: mockedSuggestions,
        config: {
          maxItemsToRequest: 5,
          hideSessionQueries: false
        }
      });
      expect(store.getters[gettersKeys.popularSearches]).toEqual(mockedSuggestions);
    });
  });
});
