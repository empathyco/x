import { deepMerge } from '@empathybroker/deep-merge';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { DeepPartial, map } from '../../../../utils';
import { historyQueriesXStoreModule } from '../module';
import { HistoryQueriesState } from '../types';
import { createHistoryQueries, createHistoryQuery } from './utils';

describe('testing history queries module gettters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(historyQueriesXStoreModule.getters, getter => getter);
  let store: Store<HistoryQueriesState> = new Store(historyQueriesXStoreModule as any);

  function resetStateWith(state: DeepPartial<HistoryQueriesState>): void {
    const newState = deepMerge(historyQueriesXStoreModule.state(), state);
    store.replaceState(newState);
  }

  describe(`${gettersKeys.historyQueries} getter`, () => {
    it('returns a maximum number of history queries', () => {
      const [ribEye, ottomanSteak, porterHouse, kafes] = createHistoryQueries(
        'Rib eye',
        'Ottoman steak',
        'Porterhouse',
        'Kafes'
      );
      resetStateWith({
        config: { maxItemsToRender: 2 },
        historyQueries: [ribEye, ottomanSteak, porterHouse, kafes]
      });

      expect(store.getters[gettersKeys.historyQueries]).toEqual([ribEye, ottomanSteak]);
    });

    it('removes queries that are equal to the state one', () => {
      const [pilsnerUrquell, zywiec, zwiecBeer, redVintage] = createHistoryQueries(
        'Pilsner Urquell',
        'Żywiec',
        'Żywiec beer',
        'Red Vintage'
      );
      resetStateWith({
        config: { maxItemsToRender: 2, hideIfEqualsQuery: true },
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
      resetStateWith({
        config: { maxItemsToRender: 2 },
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
      resetStateWith({
        historyQueries: [duvel, paulaner, hoegarden],
        sessionTimeStampInMs: Date.now() - 15
      });

      expect(store.getters[gettersKeys.sessionHistoryQueries]).toEqual([duvel]);
    });
  });
});
