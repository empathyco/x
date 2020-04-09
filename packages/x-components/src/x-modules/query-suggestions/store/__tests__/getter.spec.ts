import { deepMerge } from '@empathybroker/deep-merge';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { DeepPartial, map } from '../../../../utils';
import { querySuggestionsXStoreModule } from '../module';
import { QuerySuggestionsState } from '../types';

describe('testing query suggestions module getters', () => {
  Vue.use(Vuex);
  const getters = map(querySuggestionsXStoreModule.getters, getter => getter);
  const store: Store<QuerySuggestionsState> = new Store(querySuggestionsXStoreModule as any);

  function resetStateWith(state: DeepPartial<QuerySuggestionsState>): void {
    const newState = deepMerge(querySuggestionsXStoreModule.state(), state);
    store.replaceState(newState);
  }

  describe(`${getters.request} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetStateWith({
        query: 'dorito'
      });
      expect(store.getters[getters.request]).toEqual({ query: 'dorito', rows: 10, start: 0 });
    });

    it('should return null when there is not query', () => {
      resetStateWith({
        query: ''
      });
      expect(store.getters[getters.request]).toBeNull();
    });
  });

  describe(`${getters.normalizedQuery} getter`, () => {
    it('should return a normalized query', () => {
      const queries = ['españita', 'azúcar', 'corazón', 'barça'];
      const normalizedQueries = ['espanita', 'azucar', 'corazon', 'barca'];

      queries.forEach((query, index) => {
        resetStateWith({
          query
        });
        expect(store.getters[getters.normalizedQuery]).toEqual(normalizedQueries[index]);
      });
    });
  });
});
