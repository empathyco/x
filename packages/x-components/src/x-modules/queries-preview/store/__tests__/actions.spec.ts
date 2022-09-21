import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { SearchRequest } from '@empathyco/x-types';
import { getSearchResponseStub } from '../../../../__stubs__/search-response-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { queriesPreviewXStoreModule } from '../module';
import {
  QueriesPreviewState,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewActions,
  QueryPreviewItem
} from '../types';
import { resetQueriesPreviewStateWith } from './utils';

describe('testing queries preview module actions', () => {
  const mockedSearchResponse = getSearchResponseStub();
  const getQueryPreviewRequest = (query: string): SearchRequest => ({
    query,
    rows: 3,
    extraParams: {
      extraParam: 'extra param'
    }
  });

  const adapter = getMockedAdapter({
    search: mockedSearchResponse
  });

  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: SafeStore<
    QueriesPreviewState,
    QueriesPreviewGetters,
    QueriesPreviewMutations,
    QueriesPreviewActions
  > = new Store(queriesPreviewXStoreModule as any);
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetQueriesPreviewStateWith(store);
  });

  describe('fetchQueryPreview', () => {
    it('should make a search request with a unique id', async () => {
      const request = getQueryPreviewRequest('sandals');
      const results = await store.dispatch('fetchQueryPreview', request);

      expect(adapter.search).toHaveBeenCalledTimes(1);
      expect(adapter.search).toHaveBeenCalledWith(request, {
        id: 'fetchQueryPreview-sandals'
      });
      expect(results).toEqual(mockedSearchResponse);
    });

    it('should return `null` if the query is empty', async () => {
      const request = getQueryPreviewRequest('');
      expect(await store.dispatch('fetchQueryPreview', request)).toBeNull();
    });
  });

  describe('fetchAndSaveQueryPreview', () => {
    it('should request and store query preview results in the state', async () => {
      const query = 'tshirt';
      const request = getQueryPreviewRequest(query);
      const stateResults = store.state.queriesPreview;
      const expectedResults: QueryPreviewItem = {
        totalResults: mockedSearchResponse.totalResults,
        results: mockedSearchResponse.results,
        status: 'success',
        request: {
          extraParams: {
            extraParam: 'extra param'
          },
          query: 'tshirt',
          rows: 3
        }
      };

      const actionPromise = store.dispatch('fetchAndSaveQueryPreview', request);
      expect(stateResults[query].status).toEqual('loading');

      await actionPromise;
      expect(stateResults[query]).toEqual(expectedResults);
    });

    it('should set the status to error when it fails', async () => {
      adapter.search.mockRejectedValueOnce('Generic error');
      const query = 'sandals';
      const request = getQueryPreviewRequest(query);
      await store.dispatch('fetchAndSaveQueryPreview', request);

      expect(store.state.queriesPreview[query].status).toEqual('error');
    });

    it('should send multiple requests if the queries are different', async () => {
      const firstRequest = store.dispatch(
        'fetchAndSaveQueryPreview',
        getQueryPreviewRequest('milk')
      );
      const secondRequest = store.dispatch(
        'fetchAndSaveQueryPreview',
        getQueryPreviewRequest('cookies')
      );

      await Promise.all([firstRequest, secondRequest]);

      expect('milk' in store.state.queriesPreview).toBeTruthy();
      expect('cookies' in store.state.queriesPreview).toBeTruthy();
    });
  });
});
