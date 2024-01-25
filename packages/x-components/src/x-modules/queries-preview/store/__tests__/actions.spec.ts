import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { getSearchResponseStub } from '../../../../__stubs__/search-response-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { queriesPreviewXStoreModule } from '../module';
import {
  QueriesPreviewActions,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewState,
  QueryPreviewInfo,
  QueryPreviewItem
} from '../types';
import { getQueryPreviewRequest } from '../../../../__stubs__/queries-preview-stubs.factory';
import { getHashFromQueryPreviewInfo } from '../../utils/get-hash-from-query-preview';
import { resetQueriesPreviewStateWith } from './utils';

describe('testing queries preview module actions', () => {
  const mockedSearchResponse = getSearchResponseStub();

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
      const queryPreview: QueryPreviewInfo = { query: 'tshirt' };
      const request = getQueryPreviewRequest(queryPreview.query);
      const stateResults = store.state.queriesPreview;
      const queryId = getHashFromQueryPreviewInfo(queryPreview);
      const expectedResults: QueryPreviewItem = {
        totalResults: mockedSearchResponse.totalResults,
        results: mockedSearchResponse.results,
        instances: 1,
        status: 'success',
        request: {
          extraParams: {
            extraParam: 'extra param'
          },
          query: 'tshirt',
          rows: 3
        },
        displayTagging: {
          params: {
            follow: false,
            lang: 'es',
            q: 'lego',
            totalHits: '789'
          },
          url: 'https://api.empathybroker.com/tagging/v1/track/query'
        }
      };

      const actionPromise = store.dispatch('fetchAndSaveQueryPreview', request);
      expect(stateResults[queryId].status).toEqual('loading');

      await actionPromise;
      expect(stateResults[queryId]).toEqual(expectedResults);
    });

    it('should set the status to error when it fails', async () => {
      adapter.search.mockRejectedValueOnce('Generic error');
      const queryPreview: QueryPreviewInfo = { query: 'sandals' };
      const request = getQueryPreviewRequest(queryPreview.query);
      const queryId = getHashFromQueryPreviewInfo(queryPreview);

      await store.dispatch('fetchAndSaveQueryPreview', request);
      expect(store.state.queriesPreview[queryId].status).toEqual('error');
    });

    it('should send multiple requests if the queries are different', async () => {
      const firstQuery = getHashFromQueryPreviewInfo({ query: 'milk' });
      const secondQuery = getHashFromQueryPreviewInfo({ query: 'cookies' });
      const firstRequest = store.dispatch(
        'fetchAndSaveQueryPreview',
        getQueryPreviewRequest('milk')
      );
      const secondRequest = store.dispatch(
        'fetchAndSaveQueryPreview',
        getQueryPreviewRequest('cookies')
      );

      await Promise.all([firstRequest, secondRequest]);

      expect(firstQuery in store.state.queriesPreview).toBeTruthy();
      expect(secondQuery in store.state.queriesPreview).toBeTruthy();
    });
  });
});
