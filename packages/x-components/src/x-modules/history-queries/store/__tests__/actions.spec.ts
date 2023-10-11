import { Filter, HistoryQuery, Result } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import {
  createHistoryQueries,
  createHistoryQuery
} from '../../../../__stubs__/history-queries-stubs.factory';
import { SafeStore } from '../../../../store/__tests__/utils';
import { localStorageService } from '../../../../utils/storage';
import { HISTORY_QUERIES_ENABLED_KEY, SESSION_TIME_STAMP_STORAGE_KEY } from '../constants';
import { historyQueriesXStoreModule } from '../module';
import {
  HistoryQueriesActions,
  HistoryQueriesGetters,
  HistoryQueriesMutations,
  HistoryQueriesState
} from '../types';
import { resetHistoryQueriesStateWith } from './utils';

describe('testing history queries module actions', () => {
  Vue.use(Vuex);
  const store: SafeStore<
    HistoryQueriesState,
    HistoryQueriesGetters,
    HistoryQueriesMutations,
    HistoryQueriesActions
  > = new Store(historyQueriesXStoreModule as any);
  let currentTimeStamp = 0;
  Date.now = () => currentTimeStamp; // Mock Date.now to always return 0

  function resetStateWith(state: DeepPartial<HistoryQueriesState>): void {
    resetHistoryQueriesStateWith(store, state);
    localStorageService.setItem(store.getters.storageKey, store.state.historyQueries);
  }

  function expectHistoryQueriesToEqual(historyQueries: HistoryQuery[]): void {
    expect(store.state.historyQueries).toEqual(historyQueries);
    expect(localStorageService.getItem(store.getters.storageKey)).toEqual(historyQueries);
  }

  beforeEach(() => {
    resetStateWith({ sessionTimeStampInMs: 0 });
    currentTimeStamp = 0;
  });

  describe('addQueryToHistory', () => {
    it('does not add the query if it is empty', () => {
      store.dispatch('addQueryToHistory', ' ');

      expectHistoryQueriesToEqual([]);
    });

    it('adds the given query to the history if it is new', () => {
      const shirt = createHistoryQuery({ query: ' shirt ' });
      resetStateWith({ historyQueries: [shirt] });

      const [tShirt, jeans, longSleveShirt] = createHistoryQueries(
        't-shirt',
        'jeans',
        'long sleve shirt'
      );
      store.dispatch('addQueryToHistory', tShirt.query);
      store.dispatch('addQueryToHistory', jeans.query);
      store.dispatch('addQueryToHistory', longSleveShirt.query);

      expectHistoryQueriesToEqual([longSleveShirt, jeans, tShirt, shirt]);
    });

    it('moves a query to the first position if it was already present in the history', () => {
      const [shoes, shirt] = createHistoryQueries('shoes', 'shirt');
      resetStateWith({ historyQueries: [shoes, shirt] });

      store.dispatch('addQueryToHistory', 'shirt');

      expectHistoryQueriesToEqual([shirt, shoes]);
    });

    it('replaces last history query if the new one is more specific', () => {
      const [be, shirt] = createHistoryQueries('be', 'shirt');
      resetStateWith({ historyQueries: [be, shirt] });

      const belt = createHistoryQuery({ query: 'belt' });
      store.dispatch('addQueryToHistory', belt.query);

      expectHistoryQueriesToEqual([belt, shirt]);
    });

    it('does not modify the history if the new query is shorter than the last one', () => {
      const [shoes, shirt] = createHistoryQueries('shoes', 'shirt');
      resetStateWith({ historyQueries: [shoes, shirt] });

      store.dispatch('addQueryToHistory', 'shoe');

      expectHistoryQueriesToEqual([shoes, shirt]);
    });

    it('adds a new query if its the same than the last one stored but with less terms', () => {
      const [longSleeveShirt, jeans] = createHistoryQueries('long sleeve shirt', 'jeans');
      resetStateWith({ historyQueries: [longSleeveShirt, jeans] });

      const shirt = createHistoryQuery({ query: 'shirt' });
      store.dispatch('addQueryToHistory', shirt.query);

      expectHistoryQueriesToEqual([shirt, longSleeveShirt, jeans]);
    });

    it('saves only complete queries', () => {
      const [one, two, three, four, five] = createHistoryQueries(
        'pant',
        'pantalon',
        'pantalon a',
        'pantalon azul',
        'pantalon amarillo'
      );
      store.dispatch('addQueryToHistory', one.query);
      store.dispatch('addQueryToHistory', two.query);
      store.dispatch('addQueryToHistory', three.query);
      store.dispatch('addQueryToHistory', four.query);
      store.dispatch('addQueryToHistory', five.query);

      expectHistoryQueriesToEqual([five, four, two]);
    });

    it('only replaces last query', () => {
      const [puzzle1000, puzzleBig, puzzle] = createHistoryQueries(
        'puzzle 1000',
        'puzzle big',
        'puzzle',
        'puzzle'
      );
      store.dispatch('addQueryToHistory', puzzle1000.query);
      store.dispatch('addQueryToHistory', puzzleBig.query);
      store.dispatch('addQueryToHistory', puzzle.query);
      store.dispatch('addQueryToHistory', puzzle.query);

      expectHistoryQueriesToEqual([puzzle, puzzleBig, puzzle1000]);
    });

    it('replaces last stored query when the last word has been refined', () => {
      const [le, lego, legoSt, legoStarWars] = createHistoryQueries(
        'le',
        'lego',
        'lego st',
        'lego star wars'
      );
      store.dispatch('addQueryToHistory', le.query);
      store.dispatch('addQueryToHistory', lego.query);
      store.dispatch('addQueryToHistory', legoSt.query);
      store.dispatch('addQueryToHistory', legoStarWars.query);
      store.dispatch('addQueryToHistory', lego.query);

      expectHistoryQueriesToEqual([lego, legoStarWars]);
    });
  });

  describe('removeFromHistory', () => {
    it('removes the given query from the history', () => {
      const [caffeAmericano, capuccino, caramelMacchiato] = createHistoryQueries(
        'Caffé americano',
        'Cappuccino',
        'Caramel Macchiato'
      );
      resetStateWith({ historyQueries: [caffeAmericano, capuccino, caramelMacchiato] });

      store.dispatch('removeFromHistory', capuccino);

      expectHistoryQueriesToEqual([caffeAmericano, caramelMacchiato]);
    });
  });

  describe('setHistoryQueries', () => {
    it('sets the new history queries to the state and the browser storage', () => {
      const historyQueries = [createHistoryQuery({ query: 'Pumpkin spice latte' })];
      store.dispatch('setHistoryQueries', historyQueries);

      expectHistoryQueriesToEqual(historyQueries);
    });

    // eslint-disable-next-line max-len
    it('removes the last item if the history queries length is bigger than the maxItemsToStore property', () => {
      const [whiteMocha, espresso, completeCoffee] = createHistoryQueries(
        'whiteMocha',
        'espresso',
        'completeCoffee'
      );
      resetStateWith({
        config: {
          maxItemsToStore: 2
        }
      });

      store.dispatch('setHistoryQueries', [whiteMocha, espresso, completeCoffee]);

      expectHistoryQueriesToEqual([whiteMocha, espresso]);
    });
  });

  describe('refreshSession', () => {
    it('updates the session time stamp with the configured TTL', () => {
      localStorageService.setItem(
        SESSION_TIME_STAMP_STORAGE_KEY,
        0,
        store.state.config.sessionTTLInMs
      );
      resetStateWith({ config: { sessionTTLInMs: 20 } });

      currentTimeStamp = 5;
      store.dispatch('refreshSession');
      expect(localStorageService.getItem(SESSION_TIME_STAMP_STORAGE_KEY)).toEqual(0);
      expect(store.state.sessionTimeStampInMs).toEqual(0);

      currentTimeStamp = 24;
      expect(localStorageService.getItem(SESSION_TIME_STAMP_STORAGE_KEY)).toEqual(0);

      currentTimeStamp = 25;
      expect(localStorageService.getItem(SESSION_TIME_STAMP_STORAGE_KEY)).toBeNull();

      store.dispatch('refreshSession');
      expect(localStorageService.getItem(SESSION_TIME_STAMP_STORAGE_KEY)).toEqual(25);
      expect(store.state.sessionTimeStampInMs).toEqual(25);
    });
  });

  describe('loadHistoryQueriesFromBrowserStorage', () => {
    it('loads an empty array if storage does not contain the key', () => {
      localStorageService.removeItem(store.getters.storageKey);
      store.dispatch('loadHistoryQueriesFromBrowserStorage');

      expect(store.state.historyQueries).toEqual([]);
    });

    it('loads history queries from browser storage', () => {
      const historyQueries: HistoryQuery[] = createHistoryQueries('molleja', 'araña');
      localStorageService.setItem(store.getters.storageKey, historyQueries);
      store.dispatch('loadHistoryQueriesFromBrowserStorage');

      expect(store.state.historyQueries).toEqual(historyQueries);
    });
  });

  describe('toggleHistoryQueries', () => {
    beforeEach(() => {
      const historyQueries: HistoryQuery[] = createHistoryQueries('gato', 'perro');
      resetStateWith({ historyQueries, isEnabled: true });
    });

    it("doesn't allow new history queries to be set on disabled", async () => {
      await store.dispatch('toggleHistoryQueries', false);

      const newHistoryQuery = createHistoryQuery({ query: 'caballo' });
      await store.dispatch('setHistoryQueries', [newHistoryQuery]);

      expectHistoryQueriesToEqual([]);
    });

    it('deletes the history queries when disabled', async () => {
      const historyQueries: HistoryQuery[] = createHistoryQueries('gato', 'perro');
      expectHistoryQueriesToEqual(historyQueries);

      await store.dispatch('toggleHistoryQueries', false);
      expectHistoryQueriesToEqual([]);
    });

    it('stores the enabled/disabled value in local storage', async () => {
      expect(localStorageService.getItem<boolean>(HISTORY_QUERIES_ENABLED_KEY)).toBe(false);

      await store.dispatch('toggleHistoryQueries', true);
      expect(localStorageService.getItem<boolean>(HISTORY_QUERIES_ENABLED_KEY)).toBe(true);
    });
  });

  describe('updateHistoryQueriesWithSearchResponse', () => {
    const results: Result[] = [
      { modelName: 'Result', id: '1' },
      { modelName: 'Result', id: '2' }
    ];
    const totalResults = results.length;
    const requestFilters: Record<string, Filter[]> = {
      categoryPaths: [
        {
          id: 'categoryIds:c018019b6',
          selected: true,
          modelName: 'HierarchicalFilter'
        }
      ]
    };
    let gato: HistoryQuery, perro: HistoryQuery;

    beforeEach(() => {
      [gato, perro] = ['gato', 'perro'].map(query =>
        createHistoryQuery({
          query,
          timestamp: store.state.sessionTimeStampInMs + 1,
          selectedFilters: []
        })
      );
      resetStateWith({ historyQueries: [gato, perro] });
    });

    it('updates a history query if its response is a success', async () => {
      await store.dispatch('updateHistoryQueriesWithSearchResponse', {
        request: {
          query: 'gato',
          page: 1
        },
        status: 'success',
        results,
        totalResults
      });
      expectHistoryQueriesToEqual([{ ...gato, totalResults }, perro]);
    });

    it('does not update a history query if its response is an error', async () => {
      await store.dispatch('updateHistoryQueriesWithSearchResponse', {
        request: {
          query: 'gato',
          page: 1
        },
        status: 'error',
        results,
        totalResults
      });
      expectHistoryQueriesToEqual([gato, perro]);
    });

    it('does not update a history query if it is not stored', async () => {
      await store.dispatch('updateHistoryQueriesWithSearchResponse', {
        request: {
          query: 'pato',
          page: 1
        },
        status: 'success',
        results,
        totalResults
      });
      expectHistoryQueriesToEqual([gato, perro]);
    });

    it('updates a history query if it was made on a previous session', async () => {
      gato.totalResults = 50;
      gato.timestamp = store.state.sessionTimeStampInMs;
      resetStateWith({ historyQueries: [gato, perro] });
      await store.dispatch('updateHistoryQueriesWithSearchResponse', {
        request: {
          query: 'gato',
          page: 1
        },
        status: 'success',
        results,
        totalResults
      });
      expectHistoryQueriesToEqual([{ ...gato, totalResults }, perro]);
    });

    it('updates a history query if search response change', async () => {
      gato.totalResults = 10;
      resetStateWith({ historyQueries: [gato, perro] });
      await store.dispatch('updateHistoryQueriesWithSearchResponse', {
        request: {
          query: 'gato',
          page: 1
        },
        status: 'success',
        results,
        totalResults
      });
      expectHistoryQueriesToEqual([{ ...gato, totalResults }, perro]);
    });

    // eslint-disable-next-line max-len
    it('updates a history query if search response change because a filter is selected', async () => {
      gato.totalResults = 50;
      const selectedFilters = Object.values(requestFilters)[0];
      resetStateWith({ historyQueries: [gato, perro] });
      await store.dispatch('updateHistoryQueriesWithSearchResponse', {
        request: {
          query: 'gato',
          page: 1,
          filters: requestFilters
        },
        status: 'success',
        results,
        totalResults
      });
      expectHistoryQueriesToEqual([{ ...gato, totalResults, selectedFilters }, perro]);
    });
  });
});
