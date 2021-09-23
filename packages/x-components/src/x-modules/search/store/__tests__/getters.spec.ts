import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { SearchRequest } from '@empathyco/x-adapter';
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
        query: 'doraemon',
        params: {
          catalog: 'es'
        }
      });

      expect(store.getters[gettersKeys.request]).toEqual<SearchRequest>({
        query: 'doraemon',
        relatedTags: [],
        filters: {},
        sort: '',
        rows: 24,
        start: 0,
        catalog: 'es'
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
          pageSize: 48
        },
        params: {
          warehouse: 1234
        }
      });

      expect(store.getters[gettersKeys.request]).toEqual<SearchRequest>({
        query: 'salchipapa',
        sort: 'price-asc',
        filters: selectedFilters,
        relatedTags,
        rows: 48,
        start: 0,
        warehouse: 1234
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

    it('calculates the start parameter correctly when the page changes', () => {
      resetSearchStateWith(store, {
        query: 'salchipapa',
        page: 2,
        config: {
          pageSize: 24
        }
      });

      expect(store.getters[gettersKeys.request]).toEqual<SearchRequest>({
        query: 'salchipapa',
        filters: {},
        relatedTags: [],
        sort: '',
        rows: 48,
        start: 0
      });

      resetSearchStateWith(store, { query: 'salchipapa', page: 5 });

      expect(store.getters[gettersKeys.request]).toEqual<SearchRequest>({
        query: 'salchipapa',
        filters: {},
        relatedTags: [],
        sort: '',
        rows: 120,
        start: 0
      });

      resetSearchStateWith(store, { query: 'salchipapa', page: 1 });

      expect(store.getters[gettersKeys.request]).toEqual<SearchRequest>({
        query: 'salchipapa',
        filters: {},
        relatedTags: [],
        sort: '',
        rows: 24,
        start: 0
      });
    });

    it('calculates the start and rows parameters correctly when there is scroll down', () => {
      resetSearchStateWith(store, {
        query: 'salchipapa',
        page: 2,
        config: {
          pageSize: 24
        },
        isAppendResults: true
      });

      expect(store.getters[gettersKeys.request]).toEqual<SearchRequest>({
        query: 'salchipapa',
        filters: {},
        relatedTags: [],
        sort: '',
        rows: 24,
        start: 24
      });

      resetSearchStateWith(store, { query: 'salchipapa', page: 5, isAppendResults: true });

      expect(store.getters[gettersKeys.request]).toEqual<SearchRequest>({
        query: 'salchipapa',
        filters: {},
        relatedTags: [],
        sort: '',
        rows: 24,
        start: 96
      });

      resetSearchStateWith(store, { query: 'salchipapa', page: 1, isAppendResults: true });

      expect(store.getters[gettersKeys.request]).toEqual<SearchRequest>({
        query: 'salchipapa',
        filters: {},
        relatedTags: [],
        sort: '',
        rows: 24,
        start: 0
      });
    });
  });
});
