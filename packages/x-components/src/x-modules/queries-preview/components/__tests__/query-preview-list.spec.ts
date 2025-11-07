import type { Result, XComponentsAdapter } from '@empathyco/x-types'
import type { QueryFeature } from '../../../../types'
import type { QueryPreviewInfo } from '../../store/types'
import { flushPromises, mount } from '@vue/test-utils'
import { createResultStub, getEmptySearchResponseStub, getResultsStub } from '../../../../__stubs__'
import { XComponentsAdapterDummy } from '../../../../__tests__/adapter.dummy'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { queriesPreviewXModule } from '../../x-module'
import QueryPreviewList from '../query-preview-list.vue'
import QueryPreview from '../query-preview.vue'

const extraParams = { instance: 'empathy', lang: 'en' }

function renderQueryPreviewList({
  template = `
    <QueryPreviewList #default="{ queryPreviewInfo, results }">
      {{ queryPreviewInfo.query }} - {{results[0].name}}
    </QueryPreviewList>`,
  queriesPreviewInfo = [{ query: 'milk', extraParams }] as QueryPreviewInfo[],
  results = { milk: getResultsStub(1) } as Record<string, Result[]>,
  debounceTimeMs = 0,
  persistInCache = true,
  queryFeature = 'search_box',
  maxItemsToRender = 4,
}) {
  const adapter: XComponentsAdapter = {
    ...XComponentsAdapterDummy,
    search: jest.fn(async ({ query }) => {
      const fakeResults = results[query] ?? []
      return Promise.resolve({
        ...getEmptySearchResponseStub(),
        results: fakeResults,
        totalResults: fakeResults.length,
      })
    }),
  }

  const wrapper = mount(
    {
      template,
      components: { QueryPreviewList, QueryPreview },
    },
    {
      global: {
        plugins: [installNewXPlugin({ initialXModules: [queriesPreviewXModule], adapter })],
      },
      props: {
        queriesPreviewInfo,
        debounceTimeMs,
        persistInCache,
        queryFeature,
        maxItemsToRender,
      },
    },
  )
  return {
    adapter,
    wrapper,
    queryPreviewListWrapper: wrapper.findComponent(QueryPreviewList),
    getQueryPreviewItemWrappers: () => wrapper.findAllComponents(QueryPreview),
  }
}

describe('testing QueryPreviewList', () => {
  it('renders a list of queries one by one', async () => {
    const { getQueryPreviewItemWrappers } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'shirt', extraParams }, { query: 'jeans' }],
      results: { shirt: [createResultStub('Cool shirt')], jeans: [createResultStub('Sick jeans')] },
    })

    // Shirt query preview
    let queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews).toHaveLength(1)
    expect(queryPreviews.at(0)?.text()).toEqual('') // Query preview still is loading

    // Shirt, Jeans query previews
    await flushPromises()
    queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews).toHaveLength(2)
    expect(queryPreviews.at(0)?.text()).toEqual('shirt - Cool shirt')
    expect(queryPreviews.at(1)?.text()).toEqual('')

    await flushPromises()
    queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews).toHaveLength(2)
    expect(queryPreviews.at(0)?.text()).toEqual('shirt - Cool shirt')
    expect(queryPreviews.at(1)?.text()).toEqual('jeans - Sick jeans')
  })

  it('should propagate global props from the list to each item', async () => {
    const debounceTimeMsStub = 200
    const persistInCacheStub = false
    const queryFeatureStub: QueryFeature = 'history_query'
    const maxItemsToRenderStub = 2
    const { getQueryPreviewItemWrappers } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'shirt', extraParams }, { query: 'jeans' }],
      results: { shirt: [createResultStub('Cool shirt')], jeans: [createResultStub('Sick jeans')] },
      debounceTimeMs: debounceTimeMsStub,
      persistInCache: persistInCacheStub,
      queryFeature: queryFeatureStub,
      maxItemsToRender: maxItemsToRenderStub,
    })

    // Shirt, Jeans query previews
    await flushPromises()
    const queryPreviews = getQueryPreviewItemWrappers()

    queryPreviews.forEach(queryPreview => {
      const queryPreviewProps = queryPreview.props() as unknown as typeof QueryPreview
      expect(queryPreviewProps.debounceTimeMs).toEqual(debounceTimeMsStub)
      expect(queryPreviewProps.persistInCache).toEqual(persistInCacheStub)
      expect(queryPreviewProps.queryFeature).toEqual(queryFeatureStub)
      expect(queryPreviewProps.maxItemsToRender).toEqual(maxItemsToRenderStub)
    })
  })

  it('hides queries with no results', async () => {
    const { getQueryPreviewItemWrappers } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'noResults', extraParams }, { query: 'shoes' }],
      results: { noResults: [], shoes: [createResultStub('Crazy shoes')] },
    })

    // noResults query preview
    await flushPromises()
    let queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews).toHaveLength(1)
    expect(queryPreviews.at(0)?.text()).toEqual('')

    await flushPromises()
    queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews).toHaveLength(1)
    expect(queryPreviews.at(0)?.text()).toEqual('shoes - Crazy shoes')
  })

  it('hides queries that failed', async () => {
    const { adapter, getQueryPreviewItemWrappers } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'willFail', extraParams }, { query: 'shoes' }],
      results: {
        willFail: [createResultStub('Will fail')],
        shoes: [createResultStub('Crazy shoes')],
      },
    })

    ;(adapter.search as jest.Mock).mockRejectedValueOnce('Some error')

    // First query will fail
    await flushPromises()
    let queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews).toHaveLength(1)
    expect(queryPreviews.at(0)?.text()).toEqual('') // Query preview still is loading

    await flushPromises()
    queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews).toHaveLength(1)
    expect(queryPreviews.at(0)?.text()).toEqual('shoes - Crazy shoes')
  })

  it('load next batch when it contains duplicates', async () => {
    const { getQueryPreviewItemWrappers, wrapper } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'shirt', extraParams }, { query: 'jeans' }],
      results: {
        shirt: [createResultStub('Cool shirt')],
        jeans: [createResultStub('Sick jeans')],
        dress: [createResultStub('cool dress ')],
      },
    })
    await flushPromises()
    let queryPreviews = getQueryPreviewItemWrappers()

    expect(queryPreviews).toHaveLength(2)

    await wrapper.setProps({
      queriesPreviewInfo: [{ query: 'shirt', extraParams }, { query: 'jeans' }, { query: 'dress' }],
    } as any)
    await flushPromises()

    queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews).toHaveLength(3)
  })
})
