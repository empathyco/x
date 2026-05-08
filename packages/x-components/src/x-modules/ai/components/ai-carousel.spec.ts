import type { AiSuggestionTagging } from '@empathyco/x-types'
import type { ComponentMountingOptions } from '@vue/test-utils'
import type DisplayEmitter from '../../../components/display-emitter.vue'
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { getResultsStub } from '../../../__stubs__/results-stubs.factory'
import { getDataTestSelector } from '../../../__tests__/utils'
import { AIStarIcon, DisplayClickProvider } from '../../../components'
import { use$x, useState } from '../../../composables'
import AICarousel from './ai-carousel.vue'
import AiGroupedCarousel from './ai-grouped-carousel.vue'

vi.mock('../../../composables')
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
  group: true,
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
        ChangeHeight: {
          template: '<div><slot /></div>',
        },
        BaseEventButton: {
          template: '<button><slot /></button>',
          props: ['events'],
        },
        AiGroupedCarousel: true,
        AIStarIcon: true,
        ChevronDownIcon: true,
        ArrowRightIcon: true,
        SlidingPanel: true,
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
    get queryDisplayEmitters() {
      return wrapper.findAllComponents<typeof DisplayEmitter>(
        getDataTestSelector('ai-carousel-query-display-emitter'),
      )
    },
    get title() {
      return wrapper.find(getDataTestSelector('ai-carousel-title'))
    },
    get expandButton() {
      return wrapper.find(getDataTestSelector('ai-carousel-title-button'))
    },
    get aiStarIcon() {
      return wrapper.findComponent(AIStarIcon)
    },
    get aiGroupedCarousel() {
      return wrapper.findComponent(AiGroupedCarousel)
    },
    get displayClickProviders() {
      return wrapper.findAllComponents(DisplayClickProvider)
    },
    get suggestionsContainer() {
      return wrapper.find(getDataTestSelector('ai-carousel-suggestions-container'))
    },
    get suggestions() {
      return wrapper.findAll(getDataTestSelector('ai-carousel-suggestion'))
    },
  }
}

describe('ai-carousel component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useState).mockImplementation(useStateMock)
    vi.mocked(use$x).mockImplementation(use$xMock as any)
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
    expect(sut.title.text()).toContain('Searching for suggestion 1 and suggestion 2')
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

  it('should toggle the title expansion when clicked if it overflows', async () => {
    const sut = render()

    // Initially title is not overflowing
    expect(sut.expandButton.exists()).toBeFalsy()

    // Mock title overflowing
    const titleText = sut.wrapper.find('.x-ai-carousel-title-text')
    Object.defineProperty(titleText.element, 'scrollWidth', { value: 200, configurable: true })
    Object.defineProperty(titleText.element, 'clientWidth', { value: 100, configurable: true })

    // Trigger the resize observer callback
    resizeCallback()
    await nextTick()

    expect(sut.expandButton.exists()).toBeTruthy()

    // Click on the title to expand
    await sut.title.trigger('click')
    await nextTick()

    expect(sut.title.classes()).toContain('x-ai-carousel-title--expanded')

    // Toggle off by clicking on title again
    await sut.title.trigger('click')
    await nextTick()
    expect(sut.title.classes()).not.toContain('x-ai-carousel-title--expanded')
  })

  it('should render grouped mode when group prop is true', () => {
    const sut = render({ props: { ...propsStub, group: true } })

    expect(sut.carousel.exists()).toBeTruthy()
    expect(sut.title.text()).toContain(propsStub.title)
    expect(sut.aiStarIcon.exists()).toBeTruthy()
    expect(sut.displayEmitter.exists()).toBeTruthy()
    expect(sut.displayEmitter.props().payload).toStrictEqual(
      useStateStub.tagging.value.toolingDisplay,
    )
    expect(sut.aiGroupedCarousel.exists()).toBeTruthy()
    expect(sut.suggestionsContainer.exists()).toBeFalsy()
  })

  it('should render non-grouped mode when group prop is false', () => {
    const sut = render({ props: { ...propsStub, group: false } })

    expect(sut.aiGroupedCarousel.exists()).toBeFalsy()
    expect(sut.suggestionsContainer.exists()).toBeTruthy()
    expect(sut.suggestions).toHaveLength(useStateStub.suggestionsSearch.value.length)

    // Should have DisplayEmitters for each query
    expect(sut.queryDisplayEmitters).toHaveLength(useStateStub.suggestionsSearch.value.length)

    // Each suggestion should have DisplayClickProvider with correct props
    expect(sut.displayClickProviders).toHaveLength(useStateStub.suggestionsSearch.value.length)
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
})
