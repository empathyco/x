import { HistoryQuery } from '@empathy/search-types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { DeepPartial, map } from '../../../../utils';
import { localStorageService } from '../../../../utils/storage';
import {
  createHistoryQueries,
  createHistoryQuery
} from '../../../../__stubs__/history-queries-stubs.factory';
import { SESSION_TIME_STAMP_STORAGE_KEY } from '../constants';
import { historyQueriesXStoreModule } from '../module';
import { HistoryQueriesState } from '../types';
import { resetHistoryQueriesStateWith } from './utils';

describe('testing history queries module actions', () => {
  Vue.use(Vuex);
  let store: Store<HistoryQueriesState> = new Store(historyQueriesXStoreModule as any);
  let currentTimeStamp = 0;
  const actionsKeys = map(historyQueriesXStoreModule.actions, action => action);
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
    resetStateWith({});
    currentTimeStamp = 0;
  });

  describe(`${actionsKeys.addQueryToHistory}`, () => {
    it('does not add the query if it is empty', () => {
      store.dispatch(actionsKeys.addQueryToHistory, ' ');

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
      store.dispatch(actionsKeys.addQueryToHistory, tShirt.query);
      store.dispatch(actionsKeys.addQueryToHistory, jeans.query);
      store.dispatch(actionsKeys.addQueryToHistory, longSleveShirt.query);

      expectHistoryQueriesToEqual([longSleveShirt, jeans, tShirt, shirt]);
    });

    it('moves a query to the first position if it was already present in the history', () => {
      const [shoes, shirt] = createHistoryQueries('shoes', 'shirt');
      resetStateWith({ historyQueries: [shoes, shirt] });

      store.dispatch(actionsKeys.addQueryToHistory, 'shirt');

      expectHistoryQueriesToEqual([shirt, shoes]);
    });

    it('replaces last history query if the new one is more specific', () => {
      const [be, shirt] = createHistoryQueries('be', 'shirt');
      resetStateWith({ historyQueries: [be, shirt] });

      const belt = createHistoryQuery({ query: 'belt' });
      store.dispatch(actionsKeys.addQueryToHistory, belt.query);

      expectHistoryQueriesToEqual([belt, shirt]);
    });

    it('does not modify the history if the new query is shorter than the last one', () => {
      const [shoes, shirt] = createHistoryQueries('shoes', 'shirt');
      resetStateWith({ historyQueries: [shoes, shirt] });

      store.dispatch(actionsKeys.addQueryToHistory, 'shoe');

      expectHistoryQueriesToEqual([shoes, shirt]);
    });

    it('adds a new query if its the same than the last one stored but with less terms', () => {
      const [longSleeveShirt, jeans] = createHistoryQueries('long sleeve shirt', 'jeans');
      resetStateWith({ historyQueries: [longSleeveShirt, jeans] });

      const shirt = createHistoryQuery({ query: 'shirt' });
      store.dispatch(actionsKeys.addQueryToHistory, shirt.query);

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
      store.dispatch(actionsKeys.addQueryToHistory, one.query);
      store.dispatch(actionsKeys.addQueryToHistory, two.query);
      store.dispatch(actionsKeys.addQueryToHistory, three.query);
      store.dispatch(actionsKeys.addQueryToHistory, four.query);
      store.dispatch(actionsKeys.addQueryToHistory, five.query);

      expectHistoryQueriesToEqual([five, four, two]);
    });

    it('only replaces last query', () => {
      const [puzzle1000, puzzleBig, puzzle] = createHistoryQueries(
        'puzzle 1000',
        'puzzle big',
        'puzzle',
        'puzzle'
      );
      store.dispatch(actionsKeys.addQueryToHistory, puzzle1000.query);
      store.dispatch(actionsKeys.addQueryToHistory, puzzleBig.query);
      store.dispatch(actionsKeys.addQueryToHistory, puzzle.query);
      store.dispatch(actionsKeys.addQueryToHistory, puzzle.query);

      expectHistoryQueriesToEqual([puzzle, puzzleBig, puzzle1000]);
    });
  });

  describe(`${actionsKeys.removeFromHistory}`, () => {
    it('removes the given query from the history', () => {
      const [caffeAmericano, capuccino, caramelMacchiato] = createHistoryQueries(
        'Caffé americano',
        'Cappuccino',
        'Caramel Macchiato'
      );
      resetStateWith({ historyQueries: [caffeAmericano, capuccino, caramelMacchiato] });

      store.dispatch(actionsKeys.removeFromHistory, capuccino);

      expectHistoryQueriesToEqual([caffeAmericano, caramelMacchiato]);
    });
  });

  describe(`${actionsKeys.setHistoryQueries}`, () => {
    it('sets the new history queries to the state and the browser storage', () => {
      const historyQueries = [createHistoryQuery({ query: 'Pumpkin spice latte' })];
      store.dispatch(actionsKeys.setHistoryQueries, historyQueries);

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

      store.dispatch(actionsKeys.setHistoryQueries, [whiteMocha, espresso, completeCoffee]);

      expectHistoryQueriesToEqual([whiteMocha, espresso]);
    });
  });

  describe(`${actionsKeys.refreshSession}`, () => {
    it('updates the session time stamp with the configured TTL', () => {
      localStorageService.setItem(
        SESSION_TIME_STAMP_STORAGE_KEY,
        0,
        store.state.config.sessionTTLInMs
      );
      resetStateWith({ config: { sessionTTLInMs: 20 } });

      currentTimeStamp = 5;
      store.dispatch(actionsKeys.refreshSession);
      expect(localStorageService.getItem(SESSION_TIME_STAMP_STORAGE_KEY)).toEqual(0);
      expect(store.state.sessionTimeStampInMs).toEqual(0);

      currentTimeStamp = 24;
      expect(localStorageService.getItem(SESSION_TIME_STAMP_STORAGE_KEY)).toEqual(0);

      currentTimeStamp = 25;
      expect(localStorageService.getItem(SESSION_TIME_STAMP_STORAGE_KEY)).toBeNull();

      store.dispatch(actionsKeys.refreshSession);
      expect(localStorageService.getItem(SESSION_TIME_STAMP_STORAGE_KEY)).toEqual(25);
      expect(store.state.sessionTimeStampInMs).toEqual(25);
    });
  });

  describe(`${actionsKeys.loadHistoryQueriesFromBrowserStorage}`, () => {
    it('loads an empty array if storage does not contain the key', () => {
      localStorageService.removeItem(store.getters.storageKey);
      store.dispatch(actionsKeys.loadHistoryQueriesFromBrowserStorage);

      expect(store.state.historyQueries).toEqual([]);
    });

    it('loads history queries from browser storage', () => {
      const historyQueries: HistoryQuery[] = createHistoryQueries('molleja', 'araña');
      localStorageService.setItem(store.getters.storageKey, historyQueries);
      store.dispatch(actionsKeys.loadHistoryQueriesFromBrowserStorage);

      expect(store.state.historyQueries).toEqual(historyQueries);
    });
  });
});
