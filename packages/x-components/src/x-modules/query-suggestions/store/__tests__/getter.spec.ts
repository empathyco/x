import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { querySuggestionsXStoreModule } from '../module';
import { QuerySuggestionsState } from '../types';
import { resetQuerySuggestionsStateWith } from './utils';

describe('testing query suggestions module getters', () => {
  Vue.use(Vuex);
  const getters = map(querySuggestionsXStoreModule.getters, getter => getter);
  const store: Store<QuerySuggestionsState> = new Store(querySuggestionsXStoreModule as any);

  describe(`${getters.request} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetQuerySuggestionsStateWith(store, { query: 'dorito' });
      expect(store.getters[getters.request]).toEqual({ query: 'dorito', rows: 10, start: 0 });
    });

    it('should return null when there is not query', () => {
      resetQuerySuggestionsStateWith(store, { query: '' });
      expect(store.getters[getters.request]).toBeNull();
    });
  });

  describe(`${getters.normalizedQuery} getter`, () => {
    it('should return a normalized query', () => {
      const queries = ['españita', 'azúcar', 'corazón', 'barça'];
      const normalizedQueries = ['espanita', 'azucar', 'corazon', 'barca'];

      queries.forEach((query, index) => {
        resetQuerySuggestionsStateWith(store, { query });
        expect(store.getters[getters.normalizedQuery]).toEqual(normalizedQueries[index]);
      });
    });
  });
});
