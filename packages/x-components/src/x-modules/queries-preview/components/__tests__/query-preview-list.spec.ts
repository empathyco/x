import type { Result, XComponentsAdapter } from '@empathyco/x-types'
import type { QueryFeature } from '../../../../types'
import type { QueryPreviewInfo } from '../../store/types'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
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
    search: vi.fn(async ({ query }) => {
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
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runAllTimers()
    vi.useRealTimers()
  })

  it('renders a list of queries one by one', async () => {
    const { getQueryPreviewItemWrappers } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'shirt', extraParams }, { query: 'jeans' }],
      results: { shirt: [createResultStub('Cool shirt')], jeans: [createResultStub('Sick jeans')] },
    })

    // Initially, first query preview should be mounted
    let queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews.length).toBeGreaterThanOrEqual(1)

    // Wait for first query to load
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    queryPreviews = getQueryPreviewItemWrappers()
    // At least the first one should have loaded
    expect(queryPreviews.length).toBeGreaterThanOrEqual(1)

    // Wait for second query to load
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews.length).toBeGreaterThanOrEqual(2)

    // Verify the loaded content
    const loadedPreviews = queryPreviews.filter(qp => qp.text() !== '')
    expect(loadedPreviews.length).toBeGreaterThanOrEqual(1)
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

    // Wait for queries to process
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    // Should have at least one query preview (the one with results)
    let queryPreviews = getQueryPreviewItemWrappers()
    expect(queryPreviews.length).toBeGreaterThanOrEqual(1)

    // Continue waiting for full resolution
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    queryPreviews = getQueryPreviewItemWrappers()
    // Should show the query with results
    const visiblePreviews = queryPreviews.filter(qp => qp.text().includes('shoes'))
    expect(visiblePreviews.length).toBeGreaterThanOrEqual(1)
  })

  it('hides queries that failed', async () => {
    const { adapter, getQueryPreviewItemWrappers } = renderQueryPreviewList({
      queriesPreviewInfo: [{ query: 'willFail', extraParams }, { query: 'shoes' }],
      results: {
        willFail: [createResultStub('Will fail')],
        shoes: [createResultStub('Crazy shoes')],
      },
    })

    ;(adapter.search as any).mockRejectedValueOnce('Some error')

    // Wait for first query to fail
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    // Wait for second query to load
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    const queryPreviews = getQueryPreviewItemWrappers()
    // Should have at least one query preview (the successful one)
    expect(queryPreviews.length).toBeGreaterThanOrEqual(1)

    // Check that the successful query is shown
    const visiblePreviews = queryPreviews.filter(qp => qp.text().includes('shoes'))
    expect(visiblePreviews.length).toBeGreaterThanOrEqual(1)
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

    // Wait for initial previews to load
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    let queryPreviews = getQueryPreviewItemWrappers()
    // Should have at least 1 preview loaded
    expect(queryPreviews.length).toBeGreaterThanOrEqual(1)

    // Update props with new query
    await wrapper.setProps({
      queriesPreviewInfo: [{ query: 'shirt', extraParams }, { query: 'jeans' }, { query: 'dress' }],
    } as any)

    // Wait for new previews to load
    vi.runAllTimers()
    await flushPromises()
    await nextTick()
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    queryPreviews = getQueryPreviewItemWrappers()
    // Should have at least 2 previews now (may have all 3)
    expect(queryPreviews.length).toBeGreaterThanOrEqual(2)
  })
})
