import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { searchXStoreModule } from '../module';
import { SearchState } from '../types';
import { resetSearchStateWith } from './utils';

describe('testing search module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(searchXStoreModule.getters, getter => getter);
  const store: Store<SearchState> = new Store(searchXStoreModule as any);

  beforeEach(() => {
    resetSearchStateWith(store);
  });

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetSearchStateWith(store, {
        query: 'doraemon'
      });

      expect(store.getters[gettersKeys.request]).toEqual({
        query: 'doraemon',
        origin: 'default',
        relatedTags: [],
        rows: 24,
        start: 0
      });
    });

    it('should return null when there is not query', () => {
      expect(store.getters[gettersKeys.request]).toBeNull();
    });

    it('should return null when there is an empty query', () => {
      resetSearchStateWith(store, {
        query: ' '
      });
      expect(store.getters[gettersKeys.request]).toBeNull();
    });
  });

  describe(`${gettersKeys.results} getter`, () => {
    const mockedResults = getResultsStub();
    it('should return the results', () => {
      resetSearchStateWith(store, { results: mockedResults });
      expect(store.getters[gettersKeys.results]).toEqual(mockedResults);
    });
  });
});
