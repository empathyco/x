import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../../utils/object';
import { identifierResultsXStoreModule } from '../../module';
import { IdentifierResultsState } from '../../types';
import { resetIdentifierResultsStateWith } from './utils';

describe('testing identifier results module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(identifierResultsXStoreModule.getters, getter => getter);
  const store: Store<IdentifierResultsState> = new Store(identifierResultsXStoreModule as any);

  beforeEach(() => {
    resetIdentifierResultsStateWith(store);
  });

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetIdentifierResultsStateWith(store, { query: 'shin chan' });

      expect(store.getters[gettersKeys.request]).toEqual({
        query: 'shin chan',
        rows: 10,
        start: 0,
        origin: 'default'
      });
    });

    it('should return null when there is not query', () => {
      expect(store.getters[gettersKeys.request]).toBeNull();
    });

    it('should return null when there is an empty query', () => {
      resetIdentifierResultsStateWith(store, { query: ' ' });
      expect(store.getters[gettersKeys.request]).toBeNull();
    });
  });
});
