import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { PageableSearchRequest } from '../../types';
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
    it('should return a request object if there is a query with module properties', () => {
      resetSearchStateWith(store, {
        query: 'doraemon',
        params: {
          catalog: 'es'
        }
      });

      expect(store.getters[gettersKeys.request]).toEqual<PageableSearchRequest>({
        query: 'doraemon',
        relatedTags: [],
        filters: {},
        sort: '',
        page: 1,
        catalog: 'es'
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
