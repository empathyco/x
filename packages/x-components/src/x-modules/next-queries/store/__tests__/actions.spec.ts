import { HistoryQuery, SearchRequest } from '@empathyco/x-types';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import {
  createHistoryQueries,
  getNextQueriesStub,
  getSearchResponseStub
} from '../../../../__stubs__';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { nextQueriesXStoreModule } from '../module';
import {
  NextQueriesActions,
  NextQueriesGetters,
  NextQueriesMutations,
  NextQueriesState
} from '../types';
import { resetNextQueriesStateWith } from './utils';

describe('testing next queries module actions', () => {
  const mockedNextQueries = getNextQueriesStub();
  const mockedSearchResponse = getSearchResponseStub();

  const adapter = getMockedAdapter({
    nextQueries: { nextQueries: mockedNextQueries },
    search: mockedSearchResponse
  });

  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: SafeStore<
    NextQueriesState,
    NextQueriesGetters,
    NextQueriesMutations,
    NextQueriesActions
  > = new Store(nextQueriesXStoreModule as any);
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetNextQueriesStateWith(store);
  });

  describe('fetchNextQueries', () => {
    it('should return next queries', async () => {
      resetNextQueriesStateWith(store, {
        query: 'honeyboo'
      });

      const nextQueries = await store.dispatch('fetchNextQueries', store.getters.request);
      expect(nextQueries).toEqual(mockedNextQueries);
    });

    it('should return `null` if there is not request', async () => {
      const nextQueries = await store.dispatch('fetchNextQueries', store.getters.request);
      expect(nextQueries).toBeNull();
    });
  });

  describe('fetchAndSaveNextQueries', () => {
    it('should request and store next queries in the state', async () => {
      resetNextQueriesStateWith(store, {
        query: 'honeyboo',
        config: {
          hideSessionQueries: false
        }
      });

      const actionPromise = store.dispatch('fetchAndSaveNextQueries', store.getters.request);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.nextQueries).toEqual(mockedNextQueries);
      expect(store.state.status).toEqual('success');
    });

    it('should not clear next queries in the state if the query is empty', async () => {
      resetNextQueriesStateWith(store, { nextQueries: mockedNextQueries });

      await store.dispatch('fetchAndSaveNextQueries', store.getters.request);
      expect(store.state.nextQueries).toEqual(mockedNextQueries);
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetNextQueriesStateWith(store, { query: 'steak' });
      const initialNextQueries = store.state.nextQueries;
      adapter.nextQueries.mockResolvedValueOnce({ nextQueries: mockedNextQueries.slice(0, 1) });

      const firstRequest = store.dispatch('fetchAndSaveNextQueries', store.getters.request);
      const secondRequest = store.dispatch('fetchAndSaveNextQueries', store.getters.request);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.nextQueries).toBe(initialNextQueries);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.nextQueries).toEqual(mockedNextQueries);
    });

    it('should set the status to error when it fails', async () => {
      resetNextQueriesStateWith(store, { query: 'milk' });
      adapter.nextQueries.mockRejectedValueOnce('Generic error');
      const nextQueries = store.state.nextQueries;
      await store.dispatch('fetchAndSaveNextQueries', store.getters.request);

      expect(store.state.nextQueries).toBe(nextQueries);
      expect(store.state.status).toEqual('error');
    });
  });

  describe('cancelFetchAndSaveNextQueries', () => {
    it('should cancel the request and do not modify the stored next queries', async () => {
      resetNextQueriesStateWith(store, { query: 'honeyboo' });
      const previousNextQueries = store.state.nextQueries;
      await Promise.all([
        store.dispatch('fetchAndSaveNextQueries', store.getters.request),
        store.dispatch('cancelFetchAndSaveNextQueries')
      ]);
      expect(store.state.nextQueries).toEqual(previousNextQueries);
      expect(store.state.status).toEqual('success');
    });
  });

  describe('fetchNextQueryPreview', () => {
    it('should build the search request adding rows and extraParams from state', async () => {
      resetNextQueriesStateWith(store, {
        config: {
          maxPreviewItemsToRequest: 3
        },
        params: {
          extraParam: 'extra param'
        }
      });
      const query = 'honeyboo';
      const location = 'external';
      await store.dispatch('fetchNextQueryPreview', { query, location });
      const expectedRequest: SearchRequest = {
        query,
        rows: 3,
        extraParams: {
          extraParam: 'extra param'
        },
        origin: `next_query:${location}`
      };
      expect(adapter.search).toHaveBeenCalledWith(expectedRequest, {
        id: 'fetchNextQueryPreview-honeyboo'
      });
    });

    it('should return the search response', async () => {
      const results = await store.dispatch('fetchNextQueryPreview', {
        query: 'honeyboo',
        location: 'external'
      });
      expect(results).toEqual(mockedSearchResponse);
    });

    it('should return the search response although the location is not defined', async () => {
      const results = await store.dispatch('fetchNextQueryPreview', {
        query: 'honeyboo',
        location: undefined
      });
      expect(results).toEqual(mockedSearchResponse);
    });

    it('should return `null` if the query is empty', async () => {
      expect(
        await store.dispatch('fetchNextQueryPreview', { query: '', location: undefined })
      ).toBeNull();
    });
  });

  describe('fetchAndSaveNextQueryPreview', () => {
    it('should request and store preview results in the state', async () => {
      const query = 'tshirt';
      const location = 'external';

      const promise = store.dispatch('fetchAndSaveNextQueryPreview', {
        query: query,
        location: location
      });
      await promise;

      const expectedResults = {
        totalResults: mockedSearchResponse.totalResults,
        items: mockedSearchResponse.results,
        query
      };
      const stateResults = store.state.resultsPreview;

      expect(query in stateResults).toBeTruthy();
      expect(stateResults[query]).toEqual(expectedResults);
    });

    it('should send multiple requests if the queries are different', async () => {
      const firstRequest = store.dispatch('fetchAndSaveNextQueryPreview', {
        query: 'milk',
        location: 'predictive_layer'
      });
      const secondRequest = store.dispatch('fetchAndSaveNextQueryPreview', {
        query: 'cookies',
        location: 'predictive_layer'
      });

      await Promise.all([firstRequest, secondRequest]);

      expect('milk' in store.state.resultsPreview).toBeTruthy();
      expect('cookies' in store.state.resultsPreview).toBeTruthy();
    });
  });

  describe('setQueryFromLastHistoryQuery', () => {
    it('should set the query with the first query of history query list', async () => {
      const historyQueries = createHistoryQueries('shoes', 'shirt');
      resetNextQueriesStateWith(store, {
        config: {
          loadOnInit: true
        }
      });
      await store.dispatch('setQueryFromLastHistoryQuery', historyQueries);
      expect(store.state.query).toEqual(historyQueries[0].query);
    });
    it('should set the query to empty if there are no history query list', async () => {
      const historyQueries: HistoryQuery[] = [];
      await store.dispatch('setQueryFromLastHistoryQuery', historyQueries);
      expect(store.state.query).toBe('');
    });
  });
});
