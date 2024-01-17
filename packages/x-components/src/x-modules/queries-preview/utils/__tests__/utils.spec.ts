import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import {
  getHashFromQueryPreviewItem,
  getHashFromQueryPreviewInfo
} from '../get-hash-from-query-preview';
import { getSearchResponseStub } from '../../../../__stubs__/index';
import {
  QueriesPreviewActions,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewState,
  queriesPreviewXStoreModule,
  QueryPreviewInfo,
  QueryPreviewItem
} from '../../store/index';
import { SafeStore } from '../../../../store/__tests__/utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { resetQueriesPreviewStateWith } from '../../store/__tests__/utils';

describe('testing queries preview module utils', () => {
  const mockedSearchResponse = getSearchResponseStub();

  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: SafeStore<
    QueriesPreviewState,
    QueriesPreviewGetters,
    QueriesPreviewMutations,
    QueriesPreviewActions
  > = new Store(queriesPreviewXStoreModule as any);
  installNewXPlugin({ store }, localVue);

  beforeEach(() => {
    resetQueriesPreviewStateWith(store);
  });

  it('should check if a query hash from a QueryPreviewItem is created correctly', async () => {
    const queryPreviewItem: QueryPreviewItem = {
      totalResults: mockedSearchResponse.totalResults,
      results: mockedSearchResponse.results,
      instances: 1,
      status: 'success',
      request: {
        query: 'tshirt',
        rows: 3
      }
    };
    const queryHash = getHashFromQueryPreviewItem(queryPreviewItem);

    await store.dispatch('fetchAndSaveQueryPreview', queryPreviewItem.request);

    expect(Object.keys(store.state.queriesPreview)[0]).toBe(queryHash);
  });

  it('should check if a query hash from a QueryPreviewInfo is created correctly', () => {
    const queryPreviewInfo: QueryPreviewInfo = { query: 'tshirt' };

    const queryPreviewHash = getHashFromQueryPreviewInfo(queryPreviewInfo);

    expect(queryPreviewHash).toBe('8f58dcbfc41b2074e9311014903a1a5f');
  });

  // eslint-disable-next-line max-len
  it('should check if a query hash from a QueryPreviewInfo and from a QueryPreviewItem is the same', () => {
    const queryPreviewItem: QueryPreviewItem = {
      totalResults: mockedSearchResponse.totalResults,
      results: mockedSearchResponse.results,
      instances: 1,
      status: 'success',
      request: {
        query: 'tshirt',
        rows: 3
      }
    };
    const queryPreviewItemHash = getHashFromQueryPreviewItem(queryPreviewItem);

    const queryPreviewInfo: QueryPreviewInfo = { query: 'tshirt' };
    const queryPreviewInfoHash = getHashFromQueryPreviewInfo(queryPreviewInfo);

    expect(queryPreviewItemHash).toBe(queryPreviewInfoHash);
  });
});
