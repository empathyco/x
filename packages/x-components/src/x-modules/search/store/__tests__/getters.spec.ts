import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { SearchRequest } from '@empathy/search-adapter';
import { map } from '../../../../utils';
import { searchXStoreModule } from '../module';
import { SearchState } from '../types';
import { getSelectedRelatedTagsStub } from '../../../../__stubs__/related-tags-stubs.factory';
import { getSimpleFilterStub } from '../../../../__stubs__/filters-stubs.factory';
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

      expect(store.getters[gettersKeys.request]).toEqual<SearchRequest>({
        query: 'doraemon',
        origin: 'default',
        relatedTags: [],
        filters: {},
        sort: '',
        rows: 24,
        start: 0
      });
    });

    it('calculates the search request with the module properties', () => {
      const selectedFilters: SearchState['selectedFilters'] = { category: [getSimpleFilterStub()] };
      const relatedTags = getSelectedRelatedTagsStub();
      resetSearchStateWith(store, {
        query: 'salchipapa',
        sort: 'price-asc',
        relatedTags,
        selectedFilters,
        config: {
          maxItemsToRequest: 48
        }
      });

      expect(store.getters[gettersKeys.request]).toEqual<SearchRequest>({
        query: 'salchipapa',
        sort: 'price-asc',
        filters: selectedFilters,
        relatedTags,
        rows: 48,
        start: 0,
        origin: 'default'
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
});
