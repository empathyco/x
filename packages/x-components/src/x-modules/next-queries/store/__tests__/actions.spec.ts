import { HistoryQuery } from '@empathy/search-types';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { XPlugin } from '../../../../plugins/x-plugin';
import { map } from '../../../../utils';
import { createHistoryQueries } from '../../../../__stubs__/history-queries-stubs.factory';
import { getNextQueriesStub } from '../../../../__stubs__/next-queries-stubs.factory';
import { getMockedAdapter } from '../../../../__tests__/utils';
import { nextQueriesXStoreModule } from '../module';
import { NextQueriesState } from '../types';
import { resetNextQueriesStateWith } from './utils';

describe('testing next queries module actions', () => {
  const mockedNextQueries = getNextQueriesStub();
  const adapter = getMockedAdapter({ nextQueries: { nextQueries: mockedNextQueries } });

  const actionKeys = map(nextQueriesXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  let store: Store<NextQueriesState> = new Store(nextQueriesXStoreModule as any);
  localVue.use(XPlugin, { adapter, store });

  beforeEach(() => {
    resetNextQueriesStateWith(store);
  });

  describe(`${actionKeys.getNextQueries}`, () => {
    it('should return next queries', async () => {
      resetNextQueriesStateWith(store, {
        query: 'honeyboo'
      });

      const nextQueries = await store.dispatch(actionKeys.getNextQueries);
      expect(nextQueries).toEqual(mockedNextQueries);
    });

    it('should return empty array if there is not request', async () => {
      const nextQueries = await store.dispatch(actionKeys.getNextQueries);
      expect(nextQueries).toEqual([]);
    });
  });

  describe(`${actionKeys.getAndSaveNextQueries}`, () => {
    //eslint-disable-next-line max-len
    it('should request and store next queries in the state if hideSessionQueries is false', async () => {
      resetNextQueriesStateWith(store, {
        query: 'honeyboo',
        config: {
          hideSessionQueries: false
        }
      });

      await store.dispatch(actionKeys.getAndSaveNextQueries);
      expect(store.state.nextQueries).toEqual(mockedNextQueries);
    });

    it('should clear next queries in the state if the query is empty', async () => {
      await store.dispatch(actionKeys.getAndSaveNextQueries);
      expect(store.state.nextQueries).toEqual([]);
    });

    //eslint-disable-next-line max-len
    it('filters the next queries with the searched queries if hideSessionQueries is true', async () => {
      resetNextQueriesStateWith(store, {
        query: 'limes',
        searchedQueries: createHistoryQueries('limes'),
        config: {
          hideSessionQueries: true
        }
      });
      await store.dispatch(actionKeys.getAndSaveNextQueries);
      expect(store.state.nextQueries).toEqual(
        mockedNextQueries.filter(nextQuery => nextQuery.query !== 'limes')
      );
    });
  });

  describe(`${actionKeys.setQueryFromLastHistoryQuery}`, () => {
    it('should set the query with the first query of history query list', async () => {
      const historyQueries = createHistoryQueries('shoes', 'shirt');
      resetNextQueriesStateWith(store, {
        config: {
          loadOnInit: true
        }
      });
      await store.dispatch(actionKeys.setQueryFromLastHistoryQuery, historyQueries);
      expect(store.state.query).toEqual(historyQueries[0].query);
    });
    it('should set the query to empty if there are no history query list', async () => {
      const historyQueries: HistoryQuery[] = [];
      await store.dispatch(actionKeys.setQueryFromLastHistoryQuery, historyQueries);
      expect(store.state.query).toBe('');
    });
  });
});
