import { NextQueriesRequest } from '@empathyco/x-types';
import { map } from '@empathyco/x-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createHistoryQueries, getNextQueriesStub } from '../../../../__stubs__';
import { nextQueriesXStoreModule } from '../module';
import { NextQueriesState } from '../types';
import { resetNextQueriesStateWith } from './utils';

describe('testing next queries module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(nextQueriesXStoreModule.getters, getter => getter);
  const store: Store<NextQueriesState> = new Store(nextQueriesXStoreModule as any);

  beforeEach(() => {
    resetNextQueriesStateWith(store);
  });

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetNextQueriesStateWith(store, {
        query: 'dorito',
        config: {
          maxItemsToRequest: 5
        },
        params: {
          catalog: 'es'
        }
      });

      expect(store.getters[gettersKeys.request]).toEqual<NextQueriesRequest>({
        query: 'dorito',
        rows: 5,
        start: 0,
        extraParams: {
          catalog: 'es'
        }
      });
    });

    it('should return null when there is not query', () => {
      expect(store.getters[gettersKeys.request]).toBeNull();
    });

    it('should return null when there is an empty query', () => {
      resetNextQueriesStateWith(store, { query: ' ' });
      expect(store.getters[gettersKeys.request]).toBeNull();
    });
  });

  describe(`${gettersKeys.nextQueries} getter`, () => {
    const searchedQueries = createHistoryQueries('limes');
    const nextQueries = getNextQueriesStub();

    it('should return the next queries without the previously searched queries', () => {
      resetNextQueriesStateWith(store, {
        searchedQueries,
        nextQueries,
        config: {
          maxItemsToRequest: 5,
          hideSessionQueries: true
        }
      });
      expect(store.getters[gettersKeys.nextQueries]).toEqual(
        nextQueries.filter(nextQuery => nextQuery.query !== 'limes')
      );
    });

    it('should return all next queries if hideSessionQueries is false', () => {
      resetNextQueriesStateWith(store, {
        searchedQueries,
        nextQueries,
        config: {
          hideSessionQueries: false
        }
      });
      expect(store.getters[gettersKeys.nextQueries]).toEqual(nextQueries);
    });
  });
});
