import type { AiSuggestionTagging } from '@empathyco/x-types'
import type { ComponentMountingOptions } from '@vue/test-utils'
import type DisplayEmitter from '../../../../components/display-emitter.vue'
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory'
import { getDataTestSelector } from '../../../../__tests__/utils'
import { AIStarIcon, DisplayClickProvider, SlidingPanel } from '../../../../components'
import { use$x, useState } from '../../../../composables'
import AICarousel from '../ai-carousel.vue'

vi.mock('../../../../composables')
let resizeCallback: any
vi.mock('@vueuse/core', async importOriginal => {
  const actual = (await importOriginal()) as any
  return {
    ...actual,
    useResizeObserver: vi.fn((_el, callback) => {
      resizeCallback = callback
      return {
        stop: vi.fn(),
      }
    }),
  }
})

class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
globalThis.ResizeObserver = ResizeObserverMock as any

const useStateStub = {
  query: ref('query text'),
  suggestionsSearch: ref(
    ['suggestion 1', 'suggestion 2'].map(query => ({
      query,
      results: getResultsStub(),
    })),
  ),
  queries: ref(['suggestion 1', 'suggestion 2'].map(query => ({ query }))),
  tagging: ref<AiSuggestionTagging>({
    toolingDisplayClick: {
      url: 'toolingDisplayClick',
      params: { param1: 'value1' },
    },
    toolingDisplay: {
      url: 'toolingDisplay',
      params: { param1: 'value1' },
    },
    searchQueries: Object.fromEntries(
      ['suggestion 1', 'suggestion 2'].map((query, index) => [
        query,
        {
          toolingDisplay: {
            url: `query${index + 1}TaggingRequest`,
            params: { param1: 'value1' },
          },
          toolingDisplayClick: {
            url: `query${index + 1}TaggingClick`,
            params: { param1: 'value1' },
          },
          toolingDisplayAdd2Cart: {
            url: `query${index + 1}TaggingAdd2Cart`,
            params: { param1: 'value1' },
          },
        },
      ]),
    ),
  }),
  isNoResults: ref(false),
}

const emitMock = vi.fn()
const useStateMock = vi.fn(() => useStateStub)
const xInstance = { emit: emitMock }
const use$xMock = vi.fn(() => xInstance)

const propsStub = {
  title: 'Custom Title',
  slidingPanelClasses: 'custom-sliding-panel',
  slidingPanelContainerClasses: 'custom-container',
  slidingPanelButtonsClasses: 'custom-buttons',
}

function render(options: ComponentMountingOptions<typeof AICarousel> = {}) {
  const wrapper = mount(AICarousel, {
    props: propsStub,
    ...options,
    global: {
      stubs: {
        DisplayEmitter: {
          template: '<div v-bind="$attrs"><slot /></div>',
          props: ['payload', 'eventMetadata'],
        },
        DisplayClickProvider: {
          template: '<div><slot /></div>',
          props: ['toolingDisplayTagging', 'toolingAdd2CartTagging', 'resultFeature'],
        },
        CollapseHeight: {
          template: '<div><slot /></div>',
        },
        SlidingPanel: {
          template:
            '<div class="x-sliding-panel"><slot /><slot name="sliding-panel-left-button" /><slot name="sliding-panel-right-button" /><slot name="sliding-panel-addons" /></div>',
          props: ['scrollContainerClass', 'buttonClass', 'resetOnContentChange'],
        },
      },
    },
  })

  return {
    wrapper,
    get carousel() {
      return wrapper.find('.x-ai-carousel')
    },
    get displayEmitter() {
      return wrapper.findComponent<typeof DisplayEmitter>(
        getDataTestSelector('ai-carousel-display-emitter'),
      )
    },
    get title() {
      return wrapper.find(getDataTestSelector('ai-carousel-title'))
    },
    get expandButton() {
      return wrapper.find(getDataTestSelector('ai-carousel-title-button'))
    },
    get collapsedTitle() {
      return wrapper.find(getDataTestSelector('ai-carousel-title-collapsed'))
    },
    get aiStarIcon() {
      return wrapper.findComponent(AIStarIcon)
    },
    get slidingPanel() {
      return wrapper.findComponent(SlidingPanel)
    },
    get displayClickProviders() {
      return wrapper.findAllComponents(DisplayClickProvider)
    },
    get suggestionResults() {
      return wrapper.findAll(getDataTestSelector('ai-carousel-suggestion-result'))
    },
  }
}

describe('ai-carousel component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useState).mockImplementation(useStateMock)
    vi.mocked(use$x).mockImplementation(use$xMock as any)
  })

  it('should render the component correctly with suggestions', () => {
    const sut = render()

    expect(sut.carousel.exists()).toBeTruthy()
    expect(sut.title.text()).toContain(propsStub.title)
    expect(sut.aiStarIcon.exists()).toBeTruthy()
    expect(sut.displayEmitter.exists()).toBeTruthy()
    expect(sut.displayEmitter.props().payload).toStrictEqual(
      useStateStub.tagging.value.toolingDisplay,
    )
    expect(sut.displayEmitter.props('eventMetadata')).toStrictEqual({
      feature: 'ai_carousel',
      displayOriginalQuery: useStateStub.query.value,
      replaceable: false,
    })

    expect(sut.slidingPanel.exists()).toBeTruthy()
    expect(sut.slidingPanel.props().scrollContainerClass).toBe(
      propsStub.slidingPanelContainerClasses,
    )
    expect(sut.slidingPanel.props().buttonClass).toBe(propsStub.slidingPanelButtonsClasses)
    expect(sut.slidingPanel.classes()).toContain(propsStub.slidingPanelClasses)

    expect(sut.displayClickProviders).toHaveLength(useStateStub.suggestionsSearch.value.length)
    expect(sut.suggestionResults).toHaveLength(
      useStateStub.suggestionsSearch.value.reduce((acc, s) => acc + s.results.length, 0),
    )

    useStateStub.suggestionsSearch.value.forEach((suggestion, index) => {
      const provider = sut.displayClickProviders[index]
      expect(provider.props().resultFeature).toBe('ai_carousel')
      expect(provider.props().toolingDisplayTagging).toBe(
        useStateStub.tagging.value.searchQueries[suggestion.query].toolingDisplayClick,
      )
      expect(provider.props().toolingAdd2CartTagging).toBe(
        useStateStub.tagging.value.searchQueries[suggestion.query].toolingDisplayAdd2Cart,
      )
    })
  })

  it('should not render if there are no suggestions', () => {
    vi.mocked(useState).mockImplementation(() => ({
      ...useStateStub,
      suggestionsSearch: ref([]),
    }))
    const sut = render()
    expect(sut.carousel.exists()).toBeFalsy()
  })

  it('should render default title if title prop is not provided', () => {
    const sut = render({ props: { ...propsStub, title: undefined } })
    // Intl.ListFormat for ['suggestion 1', 'suggestion 2'] -> 'suggestion 1 and suggestion 2'
    expect(sut.title.text()).toContain('Searching for suggestion 1 and suggestion 2')
  })

  it('should use "ai-carousel-without-query" as displayOriginalQuery if query is empty', () => {
    vi.mocked(useState).mockImplementation(() => ({
      ...useStateStub,
      query: ref(''),
    }))
    const sut = render()

    expect(sut.displayEmitter.props('eventMetadata')!.displayOriginalQuery).toBe(
      'ai-carousel-without-query',
    )
  })

  it('should emit "AiSuggestionsSearchRequestUpdated" when queries change', async () => {
    const queries = ref([{ query: 'suggestion 1' }])
    vi.mocked(useState).mockImplementation(() => ({
      ...useStateStub,
      queries,
    }))
    render()

    queries.value = [...queries.value, { query: 'suggestion 2' }]
    await nextTick()

    expect(emitMock).toHaveBeenCalledWith('AiSuggestionsSearchRequestUpdated')
  })

  it('should emit AiComponentMounted event on mounted', () => {
    render()

    expect(emitMock).toHaveBeenCalledWith('AiComponentMounted', undefined, {
      feature: 'ai_carousel',
    })
  })

  it('should toggle the title expansion when clicked if it overflows', async () => {
    const sut = render()

    // Initially title is not overflowing
    expect(sut.title.exists()).toBeTruthy()
    expect(sut.collapsedTitle.exists()).toBeFalsy()
    expect(sut.expandButton.exists()).toBeFalsy()

    // Mock title overflowing
    // Mock the title element properties
    const titleText = sut.wrapper.find('.x-ai-carousel-title-text')
    Object.defineProperty(titleText.element, 'scrollWidth', { value: 200, configurable: true })
    Object.defineProperty(titleText.element, 'clientWidth', { value: 100, configurable: true })

    // Trigger the resize observer callback
    resizeCallback()
    await nextTick()

    expect(sut.title.text()).toContain(propsStub.title)
    expect(sut.collapsedTitle.exists()).toBeFalsy()
    expect(sut.expandButton.exists()).toBeTruthy()

    await sut.expandButton.trigger('click')
    await nextTick()

    // Now it's expanded, so the title-text in CollapseHeight is shown and the expandButton is still shown
    expect(sut.title.classes()).toContain('x-ai-carousel-title--expanded')
    expect(sut.expandButton.exists()).toBeTruthy()

    // Toggle off
    await sut.expandButton.trigger('click')
    await nextTick()
    expect(sut.title.classes()).not.toContain('x-ai-carousel-title--expanded')
    expect(sut.expandButton.exists()).toBeTruthy()
  })
})
