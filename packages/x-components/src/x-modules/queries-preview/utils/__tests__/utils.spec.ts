import { Store } from 'vuex';
import { defineComponent } from 'vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { SearchResponse } from '@empathyco/x-types';
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
import { queriesPreviewXModule } from '../../x-module';
import { XPlugin } from '../../../../plugins/index';

const store: SafeStore<
  QueriesPreviewState,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewActions
> = new Store(queriesPreviewXStoreModule as any);

const renderQueryPreviewUtils = (): RenderQueryPreviewUtils => {
  const component = defineComponent({
    xModule: queriesPreviewXModule.name,
    template: '<div></div>'
  });

  const mockedSearchResponse = getSearchResponseStub();

  const wrapper = mount(component, {
    global: {
      plugins: [installNewXPlugin({ initialXModules: [queriesPreviewXModule], store }), store]
    }
  });

  XPlugin.registerXModule(queriesPreviewXModule);

  return {
    mockedSearchResponse,
    store,
    wrapper
  };
};

describe('testing queries preview module utils', () => {
  it('should check if a query hash from a QueryPreviewItem is created correctly', async () => {
    const { mockedSearchResponse, store } = renderQueryPreviewUtils();
    const queryPreviewItem: QueryPreviewItem = {
      totalResults: mockedSearchResponse.totalResults,
      results: mockedSearchResponse.results,
      instances: 1,
      status: 'success',
      request: {
        query: 'tshirt',
        filters: {
          fit: [
            {
              id: 'fit:regular',
              modelName: 'RawFilter',
              selected: true
            }
          ]
        },
        rows: 3,
        extraParams: {
          lang: 'en'
        }
      }
    };
    const queryHash = getHashFromQueryPreviewItem(queryPreviewItem, 'en');

    await store.dispatch('fetchAndSaveQueryPreview', queryPreviewItem.request);

    expect(Object.keys(store.state.queriesPreview)[0]).toBe(queryHash);
  });

  it('should check if a query hash from a QueryPreviewInfo is created correctly', () => {
    const queryPreviewInfo: QueryPreviewInfo = { query: 'tshirt', filters: ['fit:regular'] };

    const queryPreviewHash = getHashFromQueryPreviewInfo(queryPreviewInfo, 'en');

    expect(queryPreviewHash).toBe('3ed535c606cfe71ff84ebd2c4271fb9c');
  });

  // eslint-disable-next-line max-len
  it('should check if a query hash from a QueryPreviewInfo and from a QueryPreviewItem is the same', () => {
    const { mockedSearchResponse } = renderQueryPreviewUtils();
    const queryPreviewItem: QueryPreviewItem = {
      totalResults: mockedSearchResponse.totalResults,
      results: mockedSearchResponse.results,
      instances: 1,
      status: 'success',
      request: {
        query: 'tshirt',
        filters: {
          fit: [
            {
              id: 'fit:regular',
              modelName: 'RawFilter',
              selected: true
            }
          ]
        },
        rows: 3
      }
    };
    const queryPreviewItemHash = getHashFromQueryPreviewItem(queryPreviewItem, 'en');

    const queryPreviewInfo: QueryPreviewInfo = { query: 'tshirt', filters: ['fit:regular'] };
    const queryPreviewInfoHash = getHashFromQueryPreviewInfo(queryPreviewInfo, 'en');

    expect(queryPreviewItemHash).toBe(queryPreviewInfoHash);
  });
});

type RenderQueryPreviewUtils = {
  mockedSearchResponse: SearchResponse;
  store: SafeStore<
    QueriesPreviewState,
    QueriesPreviewGetters,
    QueriesPreviewMutations,
    QueriesPreviewActions
  >;
  wrapper: VueWrapper;
};
