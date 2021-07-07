import { HistoryQuery } from '@empathyco/x-types';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { createHistoryQueries } from '../../../../__stubs__/history-queries-stubs.factory';
import { getNextQueriesStub } from '../../../../__stubs__/next-queries-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
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

  const store: Store<NextQueriesState> = new Store(nextQueriesXStoreModule as any);
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetNextQueriesStateWith(store);
  });

  describe(`${actionKeys.fetchNextQueries}`, () => {
    it('should return next queries', async () => {
      resetNextQueriesStateWith(store, {
        query: 'honeyboo'
      });

      const nextQueries = await store.dispatch(actionKeys.fetchNextQueries);
      expect(nextQueries).toEqual(mockedNextQueries);
    });

    it('should return `null` if there is not request', async () => {
      const nextQueries = await store.dispatch(actionKeys.fetchNextQueries);
      expect(nextQueries).toBeNull();
    });
  });

  describe(`${actionKeys.fetchAndSaveNextQueries}`, () => {
    it('should request and store next queries in the state', async () => {
      resetNextQueriesStateWith(store, {
        query: 'honeyboo',
        config: {
          hideSessionQueries: false
        }
      });

      const actionPromise = store.dispatch(actionKeys.fetchAndSaveNextQueries);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.nextQueries).toEqual(mockedNextQueries);
      expect(store.state.status).toEqual('success');
    });

    it('should not clear next queries in the state if the query is empty', async () => {
      resetNextQueriesStateWith(store, { nextQueries: mockedNextQueries });

      await store.dispatch(actionKeys.fetchAndSaveNextQueries);
      expect(store.state.nextQueries).toEqual(mockedNextQueries);
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetNextQueriesStateWith(store, { query: 'steak' });
      const initialNextQueries = store.state.nextQueries;
      adapter.getNextQueries.mockResolvedValueOnce({ nextQueries: mockedNextQueries.slice(0, 1) });

      const firstRequest = store.dispatch(actionKeys.fetchAndSaveNextQueries);
      const secondRequest = store.dispatch(actionKeys.fetchAndSaveNextQueries);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.nextQueries).toBe(initialNextQueries);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.nextQueries).toEqual(mockedNextQueries);
    });

    it('should set the status to error when it fails', async () => {
      resetNextQueriesStateWith(store, { query: 'milk' });
      adapter.getNextQueries.mockRejectedValueOnce('Generic error');
      const nextQueries = store.state.nextQueries;
      await store.dispatch(actionKeys.fetchAndSaveNextQueries);

      expect(store.state.nextQueries).toBe(nextQueries);
      expect(store.state.status).toEqual('error');
    });
  });

  describe(`${actionKeys.cancelFetchAndSaveNextQueries}`, () => {
    it('should cancel the request and do not modify the stored next queries', async () => {
      resetNextQueriesStateWith(store, { query: 'honeyboo' });
      const previousNextQueries = store.state.nextQueries;
      await Promise.all([
        store.dispatch(actionKeys.fetchAndSaveNextQueries),
        store.dispatch(actionKeys.cancelFetchAndSaveNextQueries)
      ]);
      expect(store.state.nextQueries).toEqual(previousNextQueries);
      expect(store.state.status).toEqual('success');
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
