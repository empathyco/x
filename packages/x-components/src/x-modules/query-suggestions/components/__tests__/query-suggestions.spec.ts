import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import { mount } from '@vue/test-utils'
import { useElementVisibility } from '@vueuse/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { Store } from 'vuex'
import { createQuerySuggestion } from '../../../../__stubs__/query-suggestions-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { XPlugin } from '../../../../plugins/x-plugin'
import { querySuggestionsXModule } from '../../x-module'
import QuerySuggestions from '../query-suggestions.vue'
import { resetXQuerySuggestionsStateWith } from './utils'

vi.mock('@vueuse/core', async importOriginal => ({
  ...(await importOriginal<typeof import('@vueuse/core')>()),
  useElementVisibility: vi.fn(),
}))

const isElementVisible = ref(false)
vi.mocked(useElementVisibility).mockReturnValue(isElementVisible)

function renderQuerySuggestions({
  suggestions = [
    createQuerySuggestion('chocolate'),
    createQuerySuggestion('milk chocolate'),
    createQuerySuggestion('chocolate milk'),
  ],
  maxItemsToRender = 5,
  template = '<QuerySuggestions v-bind="$attrs" />',
  requestOnlyWhenVisible = false,
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

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

  resetXQuerySuggestionsStateWith(store, { suggestions, config: { requestOnlyWhenVisible } })

  return {
    wrapper,
    suggestions,
    getSuggestionItemWrappers: () => wrapper.findAll(getDataTestSelector('suggestion-item')),
  }
}

describe('testing Query Suggestions component', () => {
  beforeEach(() => {
    isElementVisible.value = false
  })

  it('is an XComponent that belongs to the query suggestions module', () => {
    const { wrapper } = renderQuerySuggestions()

    expect(isXComponent(wrapper.findComponent(QuerySuggestions).vm)).toBeTruthy()
    expect(getXComponentXModuleName(wrapper.findComponent(QuerySuggestions).vm)).toEqual(
      'querySuggestions',
    )
  })

  it('does not render anything when suggestions are empty', () => {
    const { wrapper } = renderQuerySuggestions({ suggestions: [] })

    expect(wrapper.find('.x-query-suggestions').exists()).toBe(false)
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

  it('renders the root element without suggestions when `requestOnlyWhenVisible` is enabled', async () => {
    const { wrapper } = renderQuerySuggestions({ suggestions: [], requestOnlyWhenVisible: true })
    await nextTick()

    expect(wrapper.find('.x-query-suggestions').exists()).toBe(true)
  })

  it('emits `QuerySuggestionsVisibilityChanged` when its visibility changes', async () => {
    const { wrapper } = renderQuerySuggestions({ requestOnlyWhenVisible: true })
    const listener = vi.fn()
    XPlugin.bus.on('QuerySuggestionsVisibilityChanged').subscribe(listener)

    isElementVisible.value = true
    await nextTick()
    expect(listener).toHaveBeenNthCalledWith(1, true)

    isElementVisible.value = false
    await nextTick()
    expect(listener).toHaveBeenNthCalledWith(2, false)

    isElementVisible.value = true
    await nextTick()
    wrapper.unmount()
    expect(listener).toHaveBeenNthCalledWith(4, false)
  })
})
