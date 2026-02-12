import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store'
import type { UrlParams } from '../../../../types'
import type { QueryPreviewInfo, QueryPreviewItem } from '../../store/types'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { Store } from 'vuex'
import { getEmptySearchResponseStub, getResultsStub } from '../../../../__stubs__'
import { XComponentsAdapterDummy } from '../../../../__tests__/adapter.dummy'
import {
  findTestDataById,
  getDataTestSelector,
  installNewXPlugin,
} from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components'
import { XPlugin } from '../../../../plugins'
import { getHashFromQueryPreviewInfo } from '../../utils/get-hash-from-query-preview'
import { queriesPreviewXModule } from '../../x-module'
import QueryPreview from '../query-preview.vue'
import { resetXQueriesPreviewStateWith } from './utils'

jest.mock('../../../../composables/use-on-display', () => ({
  useOnDisplay: jest.fn(),
}))

const extraParams = { instance: 'empathy', lang: 'en' }

let mockUseOnDisplayCallback: (() => void) | null = null

async function render({
  template = `<QueryPreview :queryPreviewInfo="queryPreviewInfo" :queryFeature="queryFeature" :maxItemsToRender="maxItemsToRender" :debounceTimeMs="debounceTimeMs" :persistInCache="persistInCache" :loadWhenVisible="loadWhenVisible"/>`,
  queryPreviewInfo = { query: 'milk' } as QueryPreviewInfo,
  queryFeature = undefined as undefined | string,
  maxItemsToRender = undefined as undefined | number,
  debounceTimeMs = 0,
  persistInCache = false,
  loadWhenVisible = false,
  location = undefined as undefined | string,
  queryPreviewInState = {
    request: {},
    results: getResultsStub(4),
    status: 'success',
    instances: 1,
    totalResults: 100,
  } as QueryPreviewItem,
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  // Mock useOnDisplay to capture the callback
  const { useOnDisplay } = await import('../../../../composables/use-on-display')
  ;(useOnDisplay as jest.Mock).mockImplementation(({ callback }: { callback: () => void }) => {
    mockUseOnDisplayCallback = callback
    return {
      isElementVisible: ref(false),
      unwatchDisplay: jest.fn(),
    }
  })

  const wrapper = mount(
    {
      template,
      components: { QueryPreview },
      props: [
        'queryPreviewInfo',
        'queryFeature',
        'maxItemsToRender',
        'debounceTimeMs',
        'persistInCache',
        'loadWhenVisible',
      ],
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [queriesPreviewXModule] })],
        provide: { location },
      },
      props: {
        queryPreviewInfo,
        queryFeature,
        maxItemsToRender,
        debounceTimeMs,
        persistInCache,
        loadWhenVisible,
      },
    },
  )

  const queryPreviewInfoHash = getHashFromQueryPreviewInfo(queryPreviewInfo, extraParams)
  queryPreviewInState.request = { query: queryPreviewInfo.query }
  resetXQueriesPreviewStateWith(store, {
    queriesPreview: { [queryPreviewInfoHash]: queryPreviewInState },
  })
  store.commit('x/queriesPreview/setParams', extraParams)
  await nextTick()

  const queryPreviewRequestUpdatedSpy = jest.fn()
  XPlugin.bus.on('QueryPreviewRequestUpdated').subscribe(queryPreviewRequestUpdatedSpy)

  const queryPreviewUnmountedSpy = jest.fn()
  XPlugin.bus.on('QueryPreviewUnmounted').subscribe(queryPreviewUnmountedSpy)

  return {
    wrapper,
    queryPreviewWrapper: wrapper.findComponent(QueryPreview),
    getQueryPreviewItemWrappers: () => wrapper.findAll(getDataTestSelector('query-preview-item')),
    queryPreviewRequestUpdatedSpy,
    queryPreviewUnmountedSpy,
    queryPreviewInfo,
    queryPreviewInState,
    triggerVisibility: () => {
      if (mockUseOnDisplayCallback) {
        mockUseOnDisplayCallback()
      }
    },
    updateExtraParams: async (params: Partial<UrlParams>) => {
      store.commit('x/queriesPreview/setParams', params)
      await nextTick()
    },
  }
}

describe('query preview', () => {
  jest.useFakeTimers()
  afterEach(() => {
    jest.runAllTimers()
    jest.resetAllMocks()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('is an XComponent which has an XModule', async () => {
    const { queryPreviewWrapper } = await render()

    expect(isXComponent(queryPreviewWrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(queryPreviewWrapper.vm)).toEqual('queriesPreview')
  })

  it('does not send the `QueryPreviewRequestUpdated` event if persistInCache is true, but emits load', async () => {
    const { queryPreviewRequestUpdatedSpy, queryPreviewWrapper, queryPreviewInfo } = await render({
      persistInCache: true,
      queryPreviewInfo: {
        query: 'shoes',
        filters: ['fit:regular'],
      },
    })
    const query = getHashFromQueryPreviewInfo(queryPreviewInfo, extraParams)

    expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0)
    expect(queryPreviewWrapper.emitted('load')?.length).toEqual(1)
    expect(queryPreviewWrapper.emitted('load')?.[0]).toEqual([query])
  })

  it('emits `QueryPreviewUnmounted` when the component is being unmounted', async () => {
    const { queryPreviewUnmountedSpy, wrapper } = await render({
      persistInCache: false,
      queryPreviewInfo: {
        query: 'shoes',
        extraParams: { directory: 'Magrathea' },
        filters: ['fit:regular'],
      },
    })

    wrapper.unmount()
    expect(queryPreviewUnmountedSpy).toHaveBeenCalledTimes(1)

    const { queryPreviewUnmountedSpy: unmountedEvent, wrapper: newWrapper } = await render({
      persistInCache: true,
      queryPreviewInfo: {
        query: 'shoes',
        extraParams: { directory: 'Magrathea' },
        filters: ['fit:regular'],
      },
    })

    newWrapper.unmount()
    expect(unmountedEvent).toHaveBeenCalledTimes(1)
  })

  it('sends the `QueryPreviewRequestUpdated` event', async () => {
    const { wrapper, queryPreviewRequestUpdatedSpy, updateExtraParams } = await render({
      persistInCache: false,
    })
    await wrapper.setProps({
      queryPreviewInfo: {
        query: 'shoes',
        extraParams: { directory: 'Magrathea', ...extraParams },
        filters: ['fit:regular'],
      },
    })

    jest.advanceTimersByTime(1) // Wait for first emission.
    expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1)
    expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledWith({
      extraParams: {
        directory: 'Magrathea',
        lang: 'en',
        instance: 'empathy',
      },
      filters: {
        fit: [{ id: 'fit:regular', modelName: 'RawFilter', selected: true }],
      },
      origin: undefined,
      query: 'shoes',
      rows: 24,
    })

    // The timer is relaunched when the prop changes
    await wrapper.setProps({ queryFeature: 'popular_search' })
    await nextTick()
    // fast-forward until next timer should be executed
    jest.advanceTimersToNextTimer()

    expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(2, {
      extraParams: {
        directory: 'Magrathea',
        lang: 'en',
        instance: 'empathy',
      },
      filters: {
        fit: [{ id: 'fit:regular', modelName: 'RawFilter', selected: true }],
      },
      origin: 'popular_search:none',
      query: 'shoes',
      rows: 24,
    })

    await updateExtraParams({ store: 'Uganda' })
    jest.advanceTimersToNextTimer()

    expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(3, {
      extraParams: {
        directory: 'Magrathea',
        lang: 'en',
        instance: 'empathy',
        store: 'Uganda',
      },
      filters: {
        fit: [{ id: 'fit:regular', modelName: 'RawFilter', selected: true }],
      },
      origin: 'popular_search:none',
      query: 'shoes',
      rows: 24,
    })
  })

  it('sends the `QueryPreviewRequestUpdated` event when the application language changes', async () => {
    const { queryPreviewRequestUpdatedSpy, updateExtraParams } = await render({
      queryPreviewInfo: { query: 'shoes' },
      location: 'predictive_layer',
    })

    await updateExtraParams({ lang: 'es' })
    jest.advanceTimersToNextTimer()

    expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1)
  })

  it('sends the `QueryPreviewRequestUpdated` event with the correct location provided', async () => {
    const { queryPreviewRequestUpdatedSpy, wrapper } = await render({
      queryPreviewInfo: { query: 'shoes' },
      location: 'predictive_layer',
    })

    await wrapper.setProps({ queryFeature: 'query_suggestion' })
    jest.advanceTimersToNextTimer()

    expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(1, {
      extraParams: { lang: 'en', instance: 'empathy' },
      filters: undefined,
      origin: 'query_suggestion:predictive_layer',
      query: 'shoes',
      rows: 24,
    })
  })

  it('renders the results names in the default slot', async () => {
    const { getQueryPreviewItemWrappers, queryPreviewInState } = await render()

    queryPreviewInState.results.forEach((result, index) => {
      expect(getQueryPreviewItemWrappers().at(index)?.element).toHaveTextContent(result.name!)
    })
  })

  it('renders the specified number of results', async () => {
    const maxItemsToRender = 2
    const { queryPreviewWrapper } = await render({ maxItemsToRender })

    expect(findTestDataById(queryPreviewWrapper, 'result-name')).toHaveLength(maxItemsToRender)
  })

  it('exposes the query, the results and the totalResults in the default slot', async () => {
    const { queryPreviewInfo, queryPreviewWrapper, queryPreviewInState } = await render({
      template: `
        <QueryPreview :queryPreviewInfo="queryPreviewInfo" #default="{ results, queryPreviewInfo, totalResults}">
          <div>
            <span data-test="query-preview-query">{{ queryPreviewInfo.query }}</span>
            <span data-test="total-results">{{ totalResults }}</span>
            <div v-for="result in results" :key="result.id">
              <span data-test="result-name">{{result.name}}</span>
            </div>
          </div>
        </QueryPreview>`,
    })

    expect(
      queryPreviewWrapper.find(getDataTestSelector('query-preview-query')).element,
    ).toHaveTextContent(queryPreviewInfo.query)
    expect(
      queryPreviewWrapper.find(getDataTestSelector('total-results')).element,
    ).toHaveTextContent(queryPreviewInState.totalResults.toString())

    const resultsWrappers = findTestDataById(queryPreviewWrapper, 'result-name')

    queryPreviewInState.results.forEach((result, index) => {
      expect(resultsWrappers.at(index)?.element).toHaveTextContent(result.name!)
    })
  })

  it('allows changing the result content', async () => {
    const { queryPreviewWrapper, queryPreviewInState } = await render({
      template: `
        <QueryPreview :queryPreviewInfo="queryPreviewInfo" #result="{ result }">
          <span data-test="result-content">{{result.id}} - {{result.name}}</span>
        </QueryPreview>`,
    })

    const resultsWrapper = findTestDataById(queryPreviewWrapper, 'result-content')

    queryPreviewInState.results.forEach((result, index) => {
      expect(resultsWrapper.at(index)?.element).toHaveTextContent(`${result.id} - ${result.name!}`)
    })
  })

  it('wont render if there are no results', async () => {
    const { queryPreviewWrapper } = await render({
      queryPreviewInState: {
        request: { query: 'milk' },
        results: [],
        status: 'initial',
        totalResults: 0,
        instances: 1,
      },
    })

    expect(queryPreviewWrapper.text()).toEqual('')
  })

  it('emits load event on success', async () => {
    jest.useRealTimers()
    ;(XComponentsAdapterDummy.search as jest.Mock).mockResolvedValueOnce({
      ...getEmptySearchResponseStub(),
      results: getResultsStub(1),
      totalResults: 1,
    })
    const { queryPreviewWrapper, queryPreviewInfo } = await render({
      queryPreviewInState: {
        request: { query: 'milk' },
        results: getResultsStub(4),
        status: 'initial',
        instances: 1,
        totalResults: 100,
      },
    })
    const query = getHashFromQueryPreviewInfo(queryPreviewInfo, extraParams)

    await flushPromises()

    expect(queryPreviewWrapper.emitted('load')?.length).toEqual(1)
    expect(queryPreviewWrapper.emitted('load')?.[0]).toEqual([query])
    expect(queryPreviewWrapper.emitted('error')).toEqual(undefined)

    jest.useFakeTimers()
  })

  it('emits error event on success if results are empty', async () => {
    jest.useRealTimers()
    const { queryPreviewWrapper, queryPreviewInfo } = await render({
      queryPreviewInState: {
        request: { query: 'milk' },
        results: [],
        status: 'initial',
        totalResults: 0,
        instances: 1,
      },
    })
    const query = getHashFromQueryPreviewInfo(queryPreviewInfo, extraParams)

    await flushPromises()

    expect(queryPreviewWrapper.emitted('error')?.length).toEqual(1)
    expect(queryPreviewWrapper.emitted('error')?.[0]).toEqual([query])
    expect(queryPreviewWrapper.emitted('load')).toEqual(undefined)

    jest.useFakeTimers()
  })

  it('emits error event on error', async () => {
    jest.useRealTimers()
    ;(XComponentsAdapterDummy.search as jest.Mock).mockRejectedValueOnce('Some error')
    const { queryPreviewWrapper } = await render({
      queryPreviewInState: {
        request: { query: 'milk' },
        results: getResultsStub(4),
        status: 'initial',
        instances: 1,
        totalResults: 100,
      },
    })
    const query = getHashFromQueryPreviewInfo({ query: 'milk' }, extraParams)

    await flushPromises()

    expect(queryPreviewWrapper.emitted('error')?.length).toEqual(1)
    expect(queryPreviewWrapper.emitted('error')?.[0]).toEqual([query])
    expect(queryPreviewWrapper.emitted('load')).toEqual(undefined)
    jest.useFakeTimers()
  })

  describe('debounce', () => {
    it('requests immediately when debounce is set to 0', async () => {
      const { queryPreviewRequestUpdatedSpy, wrapper } = await render({
        debounceTimeMs: 0,
      })

      await wrapper.setProps({ queryPreviewInfo: { query: 'bull' } })
      jest.advanceTimersByTime(0)

      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(1, {
        extraParams: { lang: 'en', instance: 'empathy' },
        query: 'bull',
        rows: 24,
      })
    })

    it('does not emit subsequent requests that happen in less than the debounce time', async () => {
      const { wrapper, queryPreviewRequestUpdatedSpy } = await render({
        debounceTimeMs: 250,
      })

      await wrapper.setProps({ queryPreviewInfo: { query: 'bull' } })
      jest.advanceTimersByTime(249)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0)

      jest.advanceTimersByTime(1) // 250ms since mounting the component, the debounce tested
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(1, {
        extraParams: { lang: 'en', instance: 'empathy' },
        query: 'bull',
        rows: 24,
      })

      jest.advanceTimersByTime(249)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1)

      // Emulates user is typing a new query
      await wrapper.setProps({ queryPreviewInfo: { query: 'secall' } }) // Timer relaunched

      jest.advanceTimersByTime(249)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1)

      await wrapper.setProps({ queryPreviewInfo: { query: 'secallona' } }) // Timer relaunched

      jest.advanceTimersByTime(249)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(251)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(2)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenNthCalledWith(2, {
        extraParams: { lang: 'en', instance: 'empathy' },
        query: 'secallona',
        rows: 24,
      })
    })

    it('updates the debounced request reactively when the debounceTimeMs prop changes', async () => {
      const { wrapper, queryPreviewRequestUpdatedSpy } = await render({
        debounceTimeMs: 250,
        queryPreviewInfo: { query: 'bull' },
      })

      jest.advanceTimersByTime(249)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0)

      // Updating the debounce time aborts previous running timers
      await wrapper.setProps({ debounceTimeMs: 100 })
      jest.advanceTimersByTime(99)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0)

      jest.advanceTimersByTime(1) // 100ms since mounting the component, the debounce tested
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0)
    })

    it('cancels pending requests when the component is unmounted', async () => {
      const { wrapper, queryPreviewRequestUpdatedSpy } = await render({
        debounceTimeMs: 250,
        queryPreviewInfo: { query: 'bull' },
      })
      jest.advanceTimersByTime(249)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0)

      wrapper.unmount()
      jest.advanceTimersByTime(1)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0)
    })
  })

  describe('loadWhenVisible prop', () => {
    it('does not emit QueryPreviewRequestUpdated immediately when loadWhenVisible is true', async () => {
      const { queryPreviewRequestUpdatedSpy } = await render({
        loadWhenVisible: true,
        queryPreviewInfo: { query: 'shoes' },
        queryPreviewInState: {
          request: { query: 'shoes' },
          results: [],
          status: 'initial',
          instances: 1,
          totalResults: 0,
        },
      })

      jest.advanceTimersByTime(1)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0)
    })

    it('emits QueryPreviewRequestUpdated when component becomes visible', async () => {
      const { queryPreviewRequestUpdatedSpy, triggerVisibility } = await render({
        loadWhenVisible: true,
        queryPreviewInfo: { query: 'shoes' },
        queryPreviewInState: {
          request: { query: 'shoes' },
          results: [],
          status: 'initial',
          instances: 1,
          totalResults: 0,
        },
      })

      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(0)

      // Trigger visibility callback
      triggerVisibility()
      jest.advanceTimersByTime(1)

      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledTimes(1)
      expect(queryPreviewRequestUpdatedSpy).toHaveBeenCalledWith({
        query: 'shoes',
        rows: 24,
        extraParams: {
          instance: 'empathy',
          lang: 'en',
        },
        filters: undefined,
        origin: undefined,
      })
    })
  })
})
