import type { SearchResponse } from '@empathyco/x-types'
import type { VueWrapper } from '@vue/test-utils'
import type { SafeStore } from '../../../../store/__tests__/utils'
import type {
  QueriesPreviewActions,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewState,
  QueryPreviewInfo,
  QueryPreviewItem,
} from '../../store/index'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { Store } from 'vuex'
import { getSearchResponseStub } from '../../../../__stubs__/index'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { XPlugin } from '../../../../plugins/index'
import { queriesPreviewXStoreModule } from '../../store/index'
import { queriesPreviewXModule } from '../../x-module'
import {
  getHashFromQueryPreviewInfo,
  getHashFromQueryPreviewItem,
} from '../get-hash-from-query-preview'

const requestParams = { instance: 'empathy', lang: 'en' }

const store: SafeStore<
  QueriesPreviewState,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewActions
> = new Store(queriesPreviewXStoreModule as any)

const renderQueryPreviewUtils = (): RenderQueryPreviewUtils => {
  const component = defineComponent({
    xModule: queriesPreviewXModule.name,
    template: '<div></div>',
  })

  const mockedSearchResponse = getSearchResponseStub()

  const wrapper = mount(component, {
    global: {
      plugins: [installNewXPlugin({ initialXModules: [queriesPreviewXModule], store }), store],
    },
  })

  XPlugin.registerXModule(queriesPreviewXModule)

  return {
    mockedSearchResponse,
    store,
    wrapper,
  }
}

describe('testing queries preview module utils', () => {
  it('should check if a query hash from a QueryPreviewItem is created correctly', async () => {
    const { mockedSearchResponse, store } = renderQueryPreviewUtils()
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
              selected: true,
            },
          ],
        },
        rows: 3,
        extraParams: requestParams,
      },
    }
    const queryHash = getHashFromQueryPreviewItem(queryPreviewItem)

    await store.dispatch('fetchAndSaveQueryPreview', queryPreviewItem.request)

    expect(Object.keys(store.state.queriesPreview)[0]).toBe(queryHash)
  })

  it('should check if a query hash from a QueryPreviewInfo is created correctly', () => {
    const queryPreviewInfo: QueryPreviewInfo = { query: 'tshirt', filters: ['fit:regular'] }

    const queryPreviewHash = getHashFromQueryPreviewInfo(queryPreviewInfo, requestParams)

    expect(queryPreviewHash).toBe('9072526d15ae91731b4c8764aeeaf95e')
  })

  it('should check if a query hash from a QueryPreviewInfo and from a QueryPreviewItem is the same', () => {
    const { mockedSearchResponse } = renderQueryPreviewUtils()
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
              selected: true,
            },
          ],
        },
        rows: 3,
      },
    }
    const queryPreviewItemHash = getHashFromQueryPreviewItem(queryPreviewItem)

    const queryPreviewInfo: QueryPreviewInfo = { query: 'tshirt', filters: ['fit:regular'] }
    const queryPreviewInfoHash = getHashFromQueryPreviewInfo(queryPreviewInfo, {})

    expect(queryPreviewItemHash).toBe(queryPreviewInfoHash)
  })
})

interface RenderQueryPreviewUtils {
  mockedSearchResponse: SearchResponse
  store: SafeStore<
    QueriesPreviewState,
    QueriesPreviewGetters,
    QueriesPreviewMutations,
    QueriesPreviewActions
  >
  wrapper: VueWrapper
}
