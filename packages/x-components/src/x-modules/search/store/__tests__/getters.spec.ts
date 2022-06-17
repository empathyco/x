import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createRelatedTagStub } from '../../../../__stubs__/index';
import { SafeStore } from '../../../../store/__tests__/utils';
import { InternalSearchRequest } from '../../types';
import { searchXStoreModule } from '../module';
import { SearchActions, SearchGetters, SearchMutations, SearchState } from '../types';
import { resetSearchStateWith } from './utils';

describe('testing search module getters', () => {
  Vue.use(Vuex);
  const store: SafeStore<SearchState, SearchGetters, SearchMutations, SearchActions> = new Store(
    searchXStoreModule as any
  );

  beforeEach(() => {
    resetSearchStateWith(store);
  });

  describe(`request getter`, () => {
    it('should return a request object if there is a query with module properties', () => {
      resetSearchStateWith(store, {
        query: 'doraemon',
        page: 3,
        params: {
          catalog: 'es'
        }
      });

      expect(store.getters.request).toEqual<InternalSearchRequest>({
        query: 'doraemon',
        filters: {},
        sort: '',
        page: 3,
        extraParams: {
          catalog: 'es'
        }
      });
    });

    it('should return null when there is not query', () => {
      expect(store.getters.request).toBeNull();
    });

    it('should return null when there is an empty query', () => {
      resetSearchStateWith(store, {
        query: ' '
      });
      expect(store.getters.request).toBeNull();
    });
  });

  describe('query getter', () => {
    it('returns the query when there are no selected related tags', () => {
      resetSearchStateWith(store, {
        query: 'rum',
        relatedTags: []
      });
      expect(store.getters.query).toEqual('rum');
    });

    it('returns an empty string if there is no query', () => {
      resetSearchStateWith(store, {
        query: ' \n',
        relatedTags: [createRelatedTagStub('summer shirt', 'summer')]
      });
      expect(store.getters.query).toEqual('');
    });

    it('returns the query and the selected related tags concatenated', () => {
      resetSearchStateWith(store, {
        query: 'shirt',
        relatedTags: [
          createRelatedTagStub('summer shirt', 'summer'),
          createRelatedTagStub('summer shirt men', 'men')
        ]
      });
      expect(store.getters.query).toEqual('summer shirt men');
    });
  });
});
