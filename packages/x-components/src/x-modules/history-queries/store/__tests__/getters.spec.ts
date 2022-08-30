import { map } from '@empathyco/x-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import {
  createHistoryQueries,
  createHistoryQuery
} from '../../../../__stubs__/history-queries-stubs.factory';
import { historyQueriesXStoreModule } from '../module';
import { HistoryQueriesState } from '../types';
import { resetHistoryQueriesStateWith } from './utils';

describe('testing history queries module gettters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(historyQueriesXStoreModule.getters, getter => getter);
  const store: Store<HistoryQueriesState> = new Store(historyQueriesXStoreModule as any);

  describe(`${gettersKeys.historyQueries} getter`, () => {
    it('removes queries that are equal to the state one', () => {
      const [pilsnerUrquell, zywiec, zwiecBeer, redVintage] = createHistoryQueries(
        'Pilsner Urquell',
        'Żywiec',
        'Żywiec beer',
        'Red Vintage'
      );
      resetHistoryQueriesStateWith(store, {
        config: { hideIfEqualsQuery: true },
        historyQueries: [pilsnerUrquell, zywiec, zwiecBeer, redVintage],
        query: 'zywiec'
      });

      expect(store.getters[gettersKeys.historyQueries]).toEqual([zwiecBeer]);
    });

    it('returns only suggestions that matches with the module query', () => {
      const [steakTartar, porkShoulder, pecenaKachna] = createHistoryQueries(
        'Steak tartar',
        'Pork shoulder',
        'Pečená kachna'
      );
      resetHistoryQueriesStateWith(store, {
        historyQueries: [steakTartar, porkShoulder, pecenaKachna],
        query: 'cená'
      });

      expect(store.getters[gettersKeys.historyQueries]).toEqual([pecenaKachna]);
    });
  });

  describe(`${gettersKeys.sessionHistoryQueries} getter`, () => {
    it('only returns queries that have been made after the session started', () => {
      const [duvel, paulaner, hoegarden] = [
        createHistoryQuery({ query: 'Duvel', timestamp: Date.now() }),
        createHistoryQuery({ query: 'Paulaner', timestamp: Date.now() - 30 }),
        createHistoryQuery({ query: 'Hoegaarden', timestamp: Date.now() - 100 })
      ];
      resetHistoryQueriesStateWith(store, {
        historyQueries: [duvel, paulaner, hoegarden],
        sessionTimeStampInMs: Date.now() - 15
      });

      expect(store.getters[gettersKeys.sessionHistoryQueries]).toEqual([duvel]);
    });
  });

  describe(`${gettersKeys.normalizedQuery} getter`, () => {
    it('should return a normalized query', () => {
      const queries = ['espaÑita', 'aZúcaR', ' coraZón', 'baRça '];
      const normalizedQueries = ['espanita', 'azucar', 'corazon', 'barca'];

      queries.forEach((query, index) => {
        resetHistoryQueriesStateWith(store, { query });
        expect(store.getters[gettersKeys.normalizedQuery]).toEqual(normalizedQueries[index]);
      });
    });
  });
});
