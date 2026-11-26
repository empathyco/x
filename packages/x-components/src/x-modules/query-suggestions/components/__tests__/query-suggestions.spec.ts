import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { Store } from 'vuex'
import { createQuerySuggestion } from '../../../../__stubs__/query-suggestions-stubs.factory'
import { XComponentsAdapterDummy } from '../../../../__tests__/adapter.dummy'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { useOnDisplay } from '../../../../composables/use-on-display'
import { XPlugin } from '../../../../plugins'
import { querySuggestionsXModule } from '../../x-module'
import QuerySuggestions from '../query-suggestions.vue'
import { resetXQuerySuggestionsStateWith } from './utils'

vi.mock('../../../../composables/use-on-display', () => ({
  useOnDisplay: vi.fn(),
  useEmitDisplayEvent: vi.fn(),
}))

let mockIsElementVisible = ref(false)

function renderQuerySuggestions({
  suggestions = [
    createQuerySuggestion('chocolate'),
    createQuerySuggestion('milk chocolate'),
    createQuerySuggestion('chocolate milk'),
  ],
  maxItemsToRender = 5,
  template = '<QuerySuggestions v-bind="$attrs" />',
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  ;(XComponentsAdapterDummy.querySuggestions as any).mockResolvedValue({ suggestions: [] })

  mockIsElementVisible = ref(false)
  ;(useOnDisplay as any).mockImplementation(() => {
    return {
      isElementVisible: mockIsElementVisible,
      unwatchDisplay: vi.fn(),
    }
  })

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: { QuerySuggestions },
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [querySuggestionsXModule] })],
      },
      store,
      props: { maxItemsToRender },
    },
  )

  resetXQuerySuggestionsStateWith(store, { suggestions })

  const fetchAndSaveSpy = vi.fn()
  XPlugin.bus.on('QuerySuggestionsRequestUpdated').subscribe(fetchAndSaveSpy)

  return {
    wrapper,
    store,
    suggestions,
    fetchAndSaveSpy,
    getSuggestionItemWrappers: () => wrapper.findAll(getDataTestSelector('suggestion-item')),
    setQuery: async (query: string) => {
      store.commit('x/querySuggestions/setQuery', query)
      await nextTick()
    },
    show: async () => {
      mockIsElementVisible.value = true
      await nextTick()
    },
    hide: async () => {
      mockIsElementVisible.value = false
      await nextTick()
    },
  }
}

describe('testing Query Suggestions component', () => {
  it('is an XComponent that belongs to the query suggestions module', () => {
    const { wrapper } = renderQuerySuggestions()

    expect(isXComponent(wrapper.findComponent(QuerySuggestions).vm)).toBeTruthy()
    expect(getXComponentXModuleName(wrapper.findComponent(QuerySuggestions).vm)).toEqual(
      'querySuggestions',
    )
  })

  it('does not render anything when suggestions are empty', () => {
    const { wrapper } = renderQuerySuggestions({ suggestions: [] })

    expect(wrapper.find('x-query-suggestions').exists()).toBe(false)
  })

  it('renders the state list of suggestions', async () => {
    const { getSuggestionItemWrappers, suggestions } = renderQuerySuggestions({
      suggestions: [createQuerySuggestion('chocolate'), createQuerySuggestion('milk chocolate')],
    })
    await nextTick()
    const suggestionItemWrappers = getSuggestionItemWrappers()
    expect(suggestionItemWrappers).toHaveLength(2)
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(suggestions[index].query)
    })
  })

  it('allows to render a custom query suggestion', async () => {
    const { getSuggestionItemWrappers, suggestions } = renderQuerySuggestions({
      suggestions: [createQuerySuggestion('chocolate'), createQuerySuggestion('milk chocolate')],
      template: `
        <QuerySuggestions #suggestion="{ suggestion }">
          <button class="custom-suggestion">
            <span>🔍</span>
            <span>{{ suggestion.query }}</span>
          </button>
        </QuerySuggestions>`,
    })
    await nextTick()
    const suggestionItemWrappers = getSuggestionItemWrappers()
    expect(suggestionItemWrappers).toHaveLength(2)
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.get('.custom-suggestion').text()).toEqual(`🔍${suggestions[index].query}`)
      expect(itemWrapper.find(getDataTestSelector('query-suggestion')).exists()).toBe(false)
    })
  })

  it('allows to render a custom suggestion content', async () => {
    const { getSuggestionItemWrappers, suggestions } = renderQuerySuggestions({
      suggestions: [createQuerySuggestion('chocolate'), createQuerySuggestion('milk chocolate')],
      template: `
        <QuerySuggestions #suggestion-content="{ suggestion }">
          <span>🔍</span>
          <span>{{ suggestion.query }}</span>
        </QuerySuggestions>`,
    })
    await nextTick()
    const suggestionItemWrappers = getSuggestionItemWrappers()
    expect(suggestionItemWrappers).toHaveLength(2)
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(`🔍${suggestions[index].query}`)
      expect(itemWrapper.find(getDataTestSelector('query-suggestion')).exists()).toBe(true)
    })
  })

  it('renders at most the number of QuerySuggestion defined by `maxItemsToRender` prop', async () => {
    const { wrapper, getSuggestionItemWrappers, suggestions } = renderQuerySuggestions({
      suggestions: [
        createQuerySuggestion('shirt'),
        createQuerySuggestion('jeans'),
        createQuerySuggestion('tshirt'),
        createQuerySuggestion('jumper'),
      ],
    })

    // @ts-expect-error - TS error.
    await wrapper.setProps({ maxItemsToRender: suggestions.length - 1 })
    expect(getSuggestionItemWrappers()).toHaveLength(suggestions.length - 1)

    // @ts-expect-error - TS error.
    await wrapper.setProps({ maxItemsToRender: suggestions.length })
    expect(getSuggestionItemWrappers()).toHaveLength(suggestions.length)

    // @ts-expect-error - TS error.
    await wrapper.setProps({ maxItemsToRender: suggestions.length })
    expect(getSuggestionItemWrappers()).toHaveLength(suggestions.length)
  })
})

describe('fetch and save suggestions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  /** Flushes the XBus queued events and the store/Vue updates they trigger. */
  const flushBus = async () => {
    vi.advanceTimersByTime(1)
    await nextTick()
  }

  const expectedRequest = (query: string) => ({
    query,
    rows: 10,
    start: 0,
    extraParams: {},
  })

  it('does not emit the request on mount', async () => {
    const { fetchAndSaveSpy } = renderQuerySuggestions()

    await flushBus()

    expect(fetchAndSaveSpy).not.toHaveBeenCalled()
  })

  it('does not emit the request when it changes while the component is hidden', async () => {
    const { setQuery, fetchAndSaveSpy } = renderQuerySuggestions()

    await setQuery('milk')
    await flushBus()

    expect(fetchAndSaveSpy).not.toHaveBeenCalled()
  })

  it('does not emit the request when it changes while the component is visible', async () => {
    const { setQuery, show, fetchAndSaveSpy } = renderQuerySuggestions()

    await show()
    await setQuery('milk')
    await flushBus()

    expect(fetchAndSaveSpy).not.toHaveBeenCalled()
  })

  it('emits the request changed while visible once the component is displayed again', async () => {
    const { setQuery, show, hide, fetchAndSaveSpy } = renderQuerySuggestions()

    await show()
    await setQuery('milk')
    await hide()
    await show()
    await flushBus()

    expect(fetchAndSaveSpy).toHaveBeenCalledTimes(1)
    expect(fetchAndSaveSpy).toHaveBeenCalledWith(expectedRequest('milk'))
  })

  it('does not emit an empty request when displayed', async () => {
    const { setQuery, show, hide, fetchAndSaveSpy } = renderQuerySuggestions()

    await setQuery('milk')
    await show()
    await flushBus()
    await hide()
    await setQuery('')
    await show()
    await flushBus()

    expect(fetchAndSaveSpy).toHaveBeenCalledTimes(1)
  })

  it('emits the request when the component becomes visible after the request changed', async () => {
    const { setQuery, show, fetchAndSaveSpy } = renderQuerySuggestions()

    await setQuery('milk')
    await show()
    await flushBus()

    expect(fetchAndSaveSpy).toHaveBeenCalledTimes(1)
    expect(fetchAndSaveSpy).toHaveBeenCalledWith(expectedRequest('milk'))
  })

  it('only emits the latest request changed while hidden', async () => {
    const { setQuery, show, fetchAndSaveSpy } = renderQuerySuggestions()

    await setQuery('milk')
    await setQuery('chocolate')
    await show()
    await flushBus()

    expect(fetchAndSaveSpy).toHaveBeenCalledTimes(1)
    expect(fetchAndSaveSpy).toHaveBeenCalledWith(expectedRequest('chocolate'))
  })

  it('does not emit the request again when shown again without a request change', async () => {
    const { setQuery, show, hide, fetchAndSaveSpy } = renderQuerySuggestions()

    await setQuery('milk')
    await show()
    await flushBus()
    await hide()
    await show()
    await flushBus()

    expect(fetchAndSaveSpy).toHaveBeenCalledTimes(1)
  })

  it('does not emit a request equal to the last emitted one', async () => {
    const { setQuery, show, hide, fetchAndSaveSpy } = renderQuerySuggestions()

    await setQuery('milk')
    await show()
    await flushBus()
    await hide()
    await setQuery('chocolate')
    await setQuery('milk')
    await show()
    await flushBus()

    expect(fetchAndSaveSpy).toHaveBeenCalledTimes(1)
  })

  it('emits the request again once it changes and the component is displayed again', async () => {
    const { setQuery, show, hide, fetchAndSaveSpy } = renderQuerySuggestions()

    await setQuery('milk')
    await show()
    await flushBus()
    await hide()
    await setQuery('chocolate')
    await flushBus()
    expect(fetchAndSaveSpy).toHaveBeenCalledTimes(1)

    await show()
    await flushBus()
    expect(fetchAndSaveSpy).toHaveBeenCalledTimes(2)
    expect(fetchAndSaveSpy).toHaveBeenLastCalledWith(expectedRequest('chocolate'))
  })

  it('stops counting the component as visible once unmounted', async () => {
    const { wrapper, setQuery, show, fetchAndSaveSpy } = renderQuerySuggestions()

    await show()
    wrapper.unmount()
    await setQuery('milk')
    await flushBus()

    expect(fetchAndSaveSpy).not.toHaveBeenCalled()
  })
})
