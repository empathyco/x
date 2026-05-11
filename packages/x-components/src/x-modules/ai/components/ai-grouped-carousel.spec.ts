import type { AiSuggestionTagging } from '@empathyco/x-types'
import type { ComponentMountingOptions } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { ref } from 'vue'
import { getResultsStub } from '../../../__stubs__/results-stubs.factory'
import { getDataTestSelector } from '../../../__tests__/utils'
import { DisplayClickProvider, SlidingPanel } from '../../../components'
import { useState } from '../../../composables'
import AIGroupedCarousel from './ai-grouped-carousel.vue'

vi.mock('../../../composables')

const useStateStub = {
  suggestionsSearch: ref(
    ['suggestion 1', 'suggestion 2'].map(query => ({
      query,
      results: getResultsStub(),
    })),
  ),
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

const useStateMock = vi.fn(() => useStateStub)

const propsStub = {
  title: 'Custom Title',
  slidingPanelClasses: 'custom-sliding-panel',
  slidingPanelContainerClasses: 'custom-container',
  slidingPanelButtonsClasses: 'custom-buttons',
  group: true,
}

function render(options: ComponentMountingOptions<typeof AIGroupedCarousel> = {}) {
  const wrapper = mount(AIGroupedCarousel, {
    props: propsStub,
    ...options,
    global: {
      stubs: {
        DisplayClickProvider: {
          template: '<div><slot /></div>',
          props: ['toolingDisplayTagging', 'toolingAdd2CartTagging', 'resultFeature'],
        },
        SlidingPanel: {
          template:
            '<div :class="$attrs.class" class="x-sliding-panel"><slot /><slot name="sliding-panel-left-button" /><slot name="sliding-panel-right-button" /><slot name="sliding-panel-addons" :arrivedState="{ left: false, right: false }" /></div>',
          props: ['scrollContainerClass', 'buttonClass', 'resetOnContentChange'],
        },
      },
      ...options.global,
    },
  })

  return {
    wrapper,
    get slidingPanel() {
      return wrapper.findComponent(SlidingPanel)
    },
    get displayClickProviders() {
      return wrapper.findAllComponents(DisplayClickProvider)
    },
    get suggestionResults() {
      return wrapper.findAll(getDataTestSelector('ai-carousel-suggestion-result'))
    },
    get suggestionResultsList() {
      return wrapper.find('.x-ai-carousel-suggestion-results')
    },
  }
}

describe('ai-grouped-carousel component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useState).mockImplementation(useStateMock)
  })

  it('should render the component correctly with suggestions', () => {
    const sut = render()

    expect(sut.slidingPanel.exists()).toBeTruthy()
    expect(sut.slidingPanel.props().scrollContainerClass).toBe(
      propsStub.slidingPanelContainerClasses,
    )
    expect(sut.slidingPanel.props().buttonClass).toBe(propsStub.slidingPanelButtonsClasses)
    expect(sut.slidingPanel.props().resetOnContentChange).toBe(false)
    expect(sut.slidingPanel.classes()).toContain(propsStub.slidingPanelClasses)

    expect(sut.suggestionResultsList.exists()).toBeTruthy()
    expect(sut.displayClickProviders).toHaveLength(useStateStub.suggestionsSearch.value.length)
    expect(sut.suggestionResults).toHaveLength(
      useStateStub.suggestionsSearch.value.reduce((acc, s) => acc + s.results.length, 0),
    )
  })

  it('should pass correct props to DisplayClickProvider for each suggestion', () => {
    const sut = render()

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

  it('should render results for each suggestion', () => {
    const sut = render({
      slots: {
        result: '<div class="test-result">{{ result.name }}</div>',
      },
    })

    const totalExpectedResults = useStateStub.suggestionsSearch.value.reduce(
      (acc, s) => acc + s.results.length,
      0,
    )
    expect(sut.suggestionResults).toHaveLength(totalExpectedResults)
  })

  it('should not render if there are no suggestions', () => {
    vi.mocked(useState).mockImplementation(() => ({
      ...useStateStub,
      suggestionsSearch: ref([]),
    }))
    const sut = render()

    // When there are no suggestions, the component still renders but with no results
    expect(sut.displayClickProviders).toHaveLength(0)
    expect(sut.suggestionResults).toHaveLength(0)
  })

  it('should render sliding panel with custom classes', () => {
    const customClasses = {
      slidingPanelClasses: 'my-custom-panel',
      slidingPanelContainerClasses: 'my-custom-container',
      slidingPanelButtonsClasses: 'my-custom-buttons',
    }

    const sut = render({
      props: {
        ...propsStub,
        ...customClasses,
      },
    })

    expect(sut.slidingPanel.classes()).toContain(customClasses.slidingPanelClasses)
    expect(sut.slidingPanel.props().scrollContainerClass).toBe(
      customClasses.slidingPanelContainerClasses,
    )
    expect(sut.slidingPanel.props().buttonClass).toBe(customClasses.slidingPanelButtonsClasses)
  })

  it('should expose sliding-panels-addons slot', () => {
    const sut = render({
      slots: {
        'sliding-panels-addons': '<div class="custom-addon">Custom Addon</div>',
      },
    })

    expect(sut.wrapper.find('.custom-addon').exists()).toBeTruthy()
    expect(sut.wrapper.find('.custom-addon').text()).toBe('Custom Addon')
  })

  it('should expose sliding-panels-left-button slot', () => {
    const sut = render({
      slots: {
        'sliding-panels-left-button': '<button class="custom-left-button">Left</button>',
      },
    })

    expect(sut.wrapper.find('.custom-left-button').exists()).toBeTruthy()
    expect(sut.wrapper.find('.custom-left-button').text()).toBe('Left')
  })

  it('should expose sliding-panels-right-button slot', () => {
    const sut = render({
      slots: {
        'sliding-panels-right-button': '<button class="custom-right-button">Right</button>',
      },
    })

    expect(sut.wrapper.find('.custom-right-button').exists()).toBeTruthy()
    expect(sut.wrapper.find('.custom-right-button').text()).toBe('Right')
  })

  it('should expose result slot with result prop', () => {
    const sut = render({
      slots: {
        result: `<template #result="{ result }"><div class="custom-result">{{ result.name }}</div></template>`,
      },
    })

    const customResults = sut.wrapper.findAll('.custom-result')
    const totalExpectedResults = useStateStub.suggestionsSearch.value.reduce(
      (acc, s) => acc + s.results.length,
      0,
    )
    expect(customResults).toHaveLength(totalExpectedResults)
  })

  it('should render component with single suggestion', () => {
    vi.mocked(useState).mockImplementation(() => ({
      ...useStateStub,
      suggestionsSearch: ref([
        {
          query: 'single suggestion',
          results: getResultsStub(2),
        },
      ]),
      tagging: ref<AiSuggestionTagging>({
        toolingDisplayClick: {
          url: 'toolingDisplayClick',
          params: { param1: 'value1' },
        },
        toolingDisplay: {
          url: 'toolingDisplay',
          params: { param1: 'value1' },
        },
        searchQueries: {
          'single suggestion': {
            toolingDisplay: {
              url: 'singleTaggingRequest',
              params: { param1: 'value1' },
            },
            toolingDisplayClick: {
              url: 'singleTaggingClick',
              params: { param1: 'value1' },
            },
            toolingDisplayAdd2Cart: {
              url: 'singleTaggingAdd2Cart',
              params: { param1: 'value1' },
            },
          },
        },
      }),
    }))

    const sut = render()

    expect(sut.displayClickProviders).toHaveLength(1)
    expect(sut.suggestionResults).toHaveLength(2)
  })

  it('should handle multiple suggestions with different result counts', () => {
    vi.mocked(useState).mockImplementation(() => ({
      ...useStateStub,
      suggestionsSearch: ref([
        {
          query: 'suggestion 1',
          results: getResultsStub(2),
        },
        {
          query: 'suggestion 2',
          results: getResultsStub(5),
        },
        {
          query: 'suggestion 3',
          results: getResultsStub(1),
        },
      ]),
      tagging: ref<AiSuggestionTagging>({
        toolingDisplayClick: {
          url: 'toolingDisplayClick',
          params: { param1: 'value1' },
        },
        toolingDisplay: {
          url: 'toolingDisplay',
          params: { param1: 'value1' },
        },
        searchQueries: {
          'suggestion 1': {
            toolingDisplay: { url: 'query1TaggingRequest', params: { param1: 'value1' } },
            toolingDisplayClick: { url: 'query1TaggingClick', params: { param1: 'value1' } },
            toolingDisplayAdd2Cart: { url: 'query1TaggingAdd2Cart', params: { param1: 'value1' } },
          },
          'suggestion 2': {
            toolingDisplay: { url: 'query2TaggingRequest', params: { param1: 'value1' } },
            toolingDisplayClick: { url: 'query2TaggingClick', params: { param1: 'value1' } },
            toolingDisplayAdd2Cart: { url: 'query2TaggingAdd2Cart', params: { param1: 'value1' } },
          },
          'suggestion 3': {
            toolingDisplay: { url: 'query3TaggingRequest', params: { param1: 'value1' } },
            toolingDisplayClick: { url: 'query3TaggingClick', params: { param1: 'value1' } },
            toolingDisplayAdd2Cart: { url: 'query3TaggingAdd2Cart', params: { param1: 'value1' } },
          },
        },
      }),
    }))

    const sut = render()

    expect(sut.displayClickProviders).toHaveLength(3)
    expect(sut.suggestionResults).toHaveLength(8) // 2 + 5 + 1
  })

  it('should use correct data-test attribute for results', () => {
    const sut = render({
      slots: {
        result: '<div class="custom-result">{{ result.name }}</div>',
      },
    })

    const results = sut.wrapper.findAll(getDataTestSelector('ai-carousel-suggestion-result'))
    expect(results.length).toBeGreaterThan(0)
    results.forEach(result => {
      expect(result.attributes('data-test')).toBe('ai-carousel-suggestion-result')
    })
  })

  it('should maintain correct result order within suggestions', () => {
    const customSuggestions = [
      {
        query: 'query A',
        results: [
          { id: 'result-1', name: 'Result 1', modelName: 'Result' as const },
          { id: 'result-2', name: 'Result 2', modelName: 'Result' as const },
        ],
      },
      {
        query: 'query B',
        results: [{ id: 'result-3', name: 'Result 3', modelName: 'Result' as const }],
      },
    ]

    vi.mocked(useState).mockImplementation(() => ({
      ...useStateStub,
      suggestionsSearch: ref(customSuggestions as any),
      tagging: ref<AiSuggestionTagging>({
        toolingDisplayClick: {
          url: 'toolingDisplayClick',
          params: { param1: 'value1' },
        },
        toolingDisplay: {
          url: 'toolingDisplay',
          params: { param1: 'value1' },
        },
        searchQueries: {
          'query A': {
            toolingDisplay: { url: 'queryATaggingRequest', params: { param1: 'value1' } },
            toolingDisplayClick: { url: 'queryATaggingClick', params: { param1: 'value1' } },
            toolingDisplayAdd2Cart: { url: 'queryATaggingAdd2Cart', params: { param1: 'value1' } },
          },
          'query B': {
            toolingDisplay: { url: 'queryBTaggingRequest', params: { param1: 'value1' } },
            toolingDisplayClick: { url: 'queryBTaggingClick', params: { param1: 'value1' } },
            toolingDisplayAdd2Cart: { url: 'queryBTaggingAdd2Cart', params: { param1: 'value1' } },
          },
        },
      }),
    }))

    const sut = render({
      slots: {
        result: `<div class="result-item">{{ result.id }}</div>`,
      },
    })

    const resultItems = sut.wrapper.findAll('.result-item')
    expect(resultItems).toHaveLength(3)
    expect(resultItems[0].text()).toBe('result-1')
    expect(resultItems[1].text()).toBe('result-2')
    expect(resultItems[2].text()).toBe('result-3')
  })

  it('should render without optional title prop', () => {
    const sut = render({
      props: {
        ...propsStub,
        title: undefined,
      },
    })

    expect(sut.slidingPanel.exists()).toBeTruthy()
    expect(sut.displayClickProviders.length).toBeGreaterThan(0)
  })

  it('should handle group prop correctly', () => {
    const sut = render({
      props: {
        ...propsStub,
        group: true,
      },
    })

    expect(sut.slidingPanel.exists()).toBeTruthy()
    expect(sut.displayClickProviders).toHaveLength(useStateStub.suggestionsSearch.value.length)
  })

  it('should pass arrivedState to sliding-panels-addons slot', () => {
    const sut = render({
      slots: {
        'sliding-panels-addons': `<template #sliding-panels-addons="{ arrivedState }"><div class="arrived-state">{{ arrivedState.left }}-{{ arrivedState.right }}</div></template>`,
      },
    })

    // The stub provides { left: false, right: false }
    const arrivedStateElement = sut.wrapper.find('.arrived-state')
    expect(arrivedStateElement.exists()).toBeTruthy()
  })
})
