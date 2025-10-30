import type { AiSuggestionTagging } from '@empathyco/x-types'
import type { ComponentMountingOptions } from '@vue/test-utils'
import type { Ref } from 'vue'
import type { DisplayEmitter } from '../../../../components'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory'
import { getDataTestSelector } from '../../../../__tests__/utils'
import {
  AIStarIcon,
  ArrowRightIcon,
  BaseEventButton,
  ChevronDownIcon,
  DisplayClickProvider,
  SlidingPanel,
} from '../../../../components'
import { use$x, useGetter, useState } from '../../../../composables'
import AIOverview from '../ai-overview.vue'

jest.mock('../../../../composables')

const useGettersStub = {
  query: ref('query text'),
}
const useStateStub = {
  suggestionText: ref('suggestion text'),
  responseText: ref('response text'),
  suggestionsSearch: ref(
    ['suggestion 1', 'suggestion 2', 'suggestion 3'].map(query => ({
      query,
      results: getResultsStub(),
      tagging: {
        query: {
          url: `${query}TaggingQuery`,
          params: { param1: 'value1', param2: 'value2' },
        },
      },
    })),
  ),
  queries: ref(['suggestion 1', 'suggestion 2', 'suggestion 3'].map(query => ({ query }))),
  params: ref({ param1: 'value1', param2: 'value2' }),
  suggestionsLoading: ref(false),
  tagging: ref<AiSuggestionTagging>({
    toolingDisplayClick: {
      url: 'toolingDisplayClick',
      params: { param1: 'value1', param2: 'value2' },
    },
    toolingDisplay: {
      url: 'toolingDisplay',
      params: { param1: 'value1', param2: 'value2' },
    },
    searchQueries: Object.fromEntries(
      ['suggestion 1', 'suggestion 2', 'suggestion 3'].map((query, index) => [
        query,
        {
          toolingDisplay: {
            url: `query${index + 1}TaggingRequest`,
            params: { param1: 'value1', param2: 'value2' },
          },
          toolingDisplayClick: {
            url: `query${index + 1}TaggingClick`,
            params: { param1: 'value1', param2: 'value2' },
          },
          toolingDisplayAdd2Cart: {
            url: `query${index + 1}TaggingAdd2Cart`,
            params: { param1: 'value1', param2: 'value2' },
          },
        },
      ]),
    ),
  }),
  isNoResults: ref(false),
}
let subscribeCb = () => {}
const onMock = jest.fn(() => ({
  subscribe: (cb: () => void) => {
    subscribeCb = cb
  },
}))
const emitMock = jest.fn()
const useGettersMock = jest.fn(() => useGettersStub)
const useStateMock = jest.fn(() => useStateStub)
const xInstance = { emit: emitMock, on: onMock, noResults: false }
const use$xMock = jest.fn(() => xInstance)

const propsStub = {
  title: 'Empathy AI Overview',
  titleLoading: 'Loading AI Overview',
  expandText: 'Show more',
  collapseText: 'Show less',
  slidingPanelsClasses: 'scroll-x',
  slidingPanelContainersClasses: 'mx-auto',
  slidingPanelButtonsClasses: 'mx-8',
}

function render(options: ComponentMountingOptions<typeof AIOverview> = {}) {
  const wrapper = mount(AIOverview, {
    props: propsStub,
    ...options,
    attachTo: document.body,
    directives: {
      typing: (el: HTMLElement, binding: Ref<{ text: string }>) => {
        el.innerHTML = binding.value.text
      },
    },
    global: {
      stubs: {
        DisplayEmitter: {
          template: '<div v-bind="$attrs"><slot /></div>',
          props: ['payload', 'eventMetadata'],
        },
        DisplayClickProvider: {
          template: '<div><slot /></div>',
          props: [
            'queryTagging',
            'toolingDisplayTagging',
            'toolingAdd2CartTagging',
            'resultFeature',
          ],
        },
      },
    },
  })

  return {
    wrapper,
    get overviewWrapper() {
      return wrapper.find(getDataTestSelector('ai-overview-wrapper'))
    },
    get titleLoading() {
      return wrapper.find(getDataTestSelector('ai-overview-title-loading'))
    },
    get title() {
      return wrapper.find(getDataTestSelector('ai-overview-title'))
    },
    get aiStarIcon() {
      return wrapper.findComponent(AIStarIcon)
    },
    get content() {
      return wrapper.find(getDataTestSelector('ai-overview-content'))
    },
    get collapseHeightSuggestions() {
      return wrapper.findComponent(getDataTestSelector('ai-overview-collapse-height-suggestions'))
    },
    get suggestionsLoading() {
      return wrapper.find(getDataTestSelector('ai-overview-suggestions-loading'))
    },
    get suggestionsContainer() {
      return wrapper.find(getDataTestSelector('ai-overview-suggestions-container'))
    },
    get suggestions() {
      return wrapper.findAll(getDataTestSelector('ai-overview-suggestion'))
    },
    get baseEventButtons() {
      return wrapper.findAllComponents(BaseEventButton)
    },
    get arrowRightIcons() {
      return wrapper.findAllComponents(ArrowRightIcon)
    },
    get slidingPanels() {
      return wrapper.findAllComponents(SlidingPanel)
    },
    get toggleButtonWrapper() {
      return wrapper.find(getDataTestSelector('ai-overview-toggle-button-wrapper'))
    },
    get gradientBottom() {
      return wrapper.find(getDataTestSelector('ai-overview-gradient'))
    },
    get toggleButton() {
      return wrapper.find(getDataTestSelector('ai-overview-toggle-button'))
    },
    get chevronDownIcon() {
      return wrapper.findComponent(ChevronDownIcon)
    },
    get displayEmitter() {
      return wrapper.findComponent<typeof DisplayEmitter>(
        getDataTestSelector('ai-overview-display-emitter'),
      )
    },
    get queryDisplayEmitters() {
      return wrapper.findAllComponents<typeof DisplayEmitter>(
        getDataTestSelector('ai-overview-query-display-emitter'),
      )
    },
    get displayClickProviders() {
      return wrapper.findAllComponents(DisplayClickProvider)
    },
  }
}

//TODO: Add the remaining tests
describe('ai-overview component', () => {
  const originalScrollIntoView = (Element.prototype as any).scrollIntoView

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
    ;(Element.prototype as any).scrollIntoView = jest.fn()
    jest.mocked(useGetter).mockImplementation(useGettersMock)
    jest.mocked(useState).mockImplementation(useStateMock)
    jest.mocked(use$x).mockImplementation(use$xMock as any)
    xInstance.noResults = false
  })

  afterAll(() => {
    ;(Element.prototype as any).scrollIntoView = originalScrollIntoView
  })

  it('should render the component by default', () => {
    const sut = render()

    expect(sut.overviewWrapper.exists()).toBeTruthy()
    expect(sut.titleLoading.exists()).toBeFalsy()
    expect(sut.displayEmitter.exists()).toBeTruthy()
    expect(sut.displayEmitter.props().payload).toStrictEqual(
      useStateStub.tagging.value.toolingDisplay,
    )
    expect(sut.displayEmitter.props().eventMetadata).toStrictEqual({
      feature: 'overview',
      displayOriginalQuery: useGettersStub.query.value,
      replaceable: false,
    })
    expect(sut.title.exists()).toBeTruthy()
    expect(sut.title.text()).toBe(propsStub.title)
    expect(sut.aiStarIcon.exists()).toBeTruthy()
    expect(sut.content.text()).toContain(useStateStub.suggestionText.value)
    expect(sut.content.text()).toContain(useStateStub.responseText.value)
    expect(sut.collapseHeightSuggestions.exists()).toBeTruthy()
    expect(sut.collapseHeightSuggestions.attributes().style).toBe(
      `--x-collapse-height-transition-duration: ${300 * useStateStub.suggestionsSearch.value.length}ms;`,
    )
    expect(sut.suggestionsContainer.isVisible()).toBeFalsy()
    expect(sut.baseEventButtons).toHaveLength(useStateStub.suggestionsSearch.value.length)
    expect(sut.slidingPanels).toHaveLength(useStateStub.suggestionsSearch.value.length)
    expect(sut.queryDisplayEmitters).toHaveLength(useStateStub.suggestionsSearch.value.length)
    expect(sut.arrowRightIcons).toHaveLength(useStateStub.suggestionsSearch.value.length)

    useStateStub.suggestionsSearch.value.forEach((suggestionSearch, suggestionIndex) => {
      expect(sut.queryDisplayEmitters[suggestionIndex].props().eventMetadata).toStrictEqual({
        feature: 'overview',
        displayOriginalQuery: useGettersStub.query.value,
        replaceable: false,
      })
      expect(sut.queryDisplayEmitters[suggestionIndex].props().payload).toStrictEqual(
        useStateStub.tagging.value.searchQueries[suggestionSearch.query].toolingDisplay,
      )
      expect(sut.displayClickProviders[suggestionIndex].props().resultFeature).toBe('overview')
      expect(sut.displayClickProviders[suggestionIndex].props().queryTagging).toBe(
        useStateStub.suggestionsSearch.value[suggestionIndex].tagging.query,
      )
      expect(sut.displayClickProviders[suggestionIndex].props().toolingDisplayTagging).toBe(
        useStateStub.tagging.value.searchQueries[suggestionSearch.query].toolingDisplayClick,
      )
      expect(sut.displayClickProviders[suggestionIndex].props().toolingAdd2CartTagging).toBe(
        useStateStub.tagging.value.searchQueries[suggestionSearch.query].toolingDisplayAdd2Cart,
      )
      expect(sut.baseEventButtons[suggestionIndex].text()).toBe(suggestionSearch.query)
      expect(sut.baseEventButtons[suggestionIndex].props().events).toStrictEqual({
        UserAcceptedAQuery: suggestionSearch.query,
      })
      expect(sut.slidingPanels[suggestionIndex].props('resetOnContentChange')).toBeFalsy()
      expect(sut.slidingPanels[suggestionIndex].props('scrollContainerClass')).toBe(
        propsStub.slidingPanelContainersClasses,
      )
      expect(sut.slidingPanels[suggestionIndex].props('buttonClass')).toBe(
        propsStub.slidingPanelButtonsClasses,
      )
      expect(sut.slidingPanels[suggestionIndex].classes()).toContain(propsStub.slidingPanelsClasses)
      const results = sut.slidingPanels[suggestionIndex].findAll(
        getDataTestSelector('ai-overview-suggestion-result'),
      )

      expect(results).toHaveLength(suggestionSearch.results.length)

      results.forEach((result, resultIndex) => {
        expect(result.attributes().style).toBe(
          `animation-delay: ${suggestionIndex * 300 + resultIndex * 300}ms;`,
        )
      })
    })

    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)
    expect(sut.chevronDownIcon.exists()).toBeTruthy()
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-expanded')

    expect(onMock).toHaveBeenCalledWith('AiSuggestionsRequestUpdated', false)
  })

  it('should render with loading state correctly', () => {
    jest
      .mocked(useState)
      .mockImplementation(() => ({ ...useStateStub, suggestionsLoading: ref(true) }))

    const sut = render()

    expect(sut.titleLoading.exists()).toBeTruthy()
    expect(sut.titleLoading.text()).toBe(propsStub.titleLoading)
    expect(sut.title.exists()).toBeFalsy()
    expect(sut.displayEmitter.exists()).toBeFalsy()
  })

  it('should render with expanded state correctly when clicking on toggle button', async () => {
    const sut = render()

    expect(sut.suggestionsContainer.isVisible()).toBeFalsy()
    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-expanded')

    await sut.toggleButton.trigger('click')

    expect(sut.suggestionsContainer.isVisible()).toBeTruthy()
    expect(sut.gradientBottom.isVisible()).toBeFalsy()
    expect(sut.toggleButton.text()).toBe(propsStub.collapseText)
    expect(sut.chevronDownIcon.classes()).toContain('x-ai-overview-toggle-btn-icon-expanded')
  })

  it('should render with expanded state correctly when clicking on toggle button wrapper', async () => {
    const sut = render()

    expect(sut.suggestionsContainer.isVisible()).toBeFalsy()
    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-expanded')

    await sut.toggleButtonWrapper.trigger('click')

    expect(sut.suggestionsContainer.isVisible()).toBeTruthy()
    expect(sut.gradientBottom.isVisible()).toBeFalsy()
    expect(sut.toggleButton.text()).toBe(propsStub.collapseText)
    expect(sut.chevronDownIcon.classes()).toContain('x-ai-overview-toggle-btn-icon-expanded')
  })

  it('should collapse the suggestions when the ai suggestion request changes', async () => {
    const sut = render()

    await sut.toggleButton.trigger('click')

    expect(sut.suggestionsContainer.isVisible()).toBeTruthy()
    expect(sut.gradientBottom.isVisible()).toBeFalsy()
    expect(sut.toggleButton.text()).toBe(propsStub.collapseText)
    expect(sut.chevronDownIcon.classes()).toContain('x-ai-overview-toggle-btn-icon-expanded')

    subscribeCb()
    await sut.wrapper.vm.$nextTick()

    expect(sut.suggestionsContainer.isVisible()).toBeFalsy()
    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-expanded')
  })

  it('should emit event when toggle button is clicked', async () => {
    const sut = render()

    await sut.toggleButton.trigger('click')

    expect(sut.suggestionsContainer.isVisible()).toBeTruthy()

    expect(emitMock).toHaveBeenCalledWith('UserClickedAiOverviewExpandButton', false, {
      suggestionText: useStateStub.suggestionText.value,
      toolingDisplayClick: useStateStub.tagging.value?.toolingDisplayClick,
    })
  })

  it('should render correctly if suggestion is loading', () => {
    jest
      .mocked(useState)
      .mockImplementation(() => ({ ...useStateStub, suggestionsSearch: ref([]) }))

    const sut = render()

    expect(sut.suggestionsLoading.exists()).toBeTruthy()
    expect(sut.suggestionsContainer.exists()).toBeFalsy()
  })

  it('should show suggestionText as title when title prop is empty, and hide the suggestionText span in content', async () => {
    const sut = render({ props: { ...propsStub, title: undefined } })

    expect(sut.title.text()).toBe(useStateStub.suggestionText.value)

    const contentSpan = sut.content.find('span')
    expect(contentSpan.exists()).toBeFalsy()

    expect(sut.content.text()).toContain(useStateStub.responseText.value)
  })

  it('should not render query button nor sliding panel for queries without results', async () => {
    const queriesWithOrphan = ref([
      { query: 'suggestion 1' },
      { query: 'suggestion 2' },
      { query: 'suggestion 3' },
      { query: 'orphan query (no results)' },
    ])

    jest
      .mocked(useState)
      .mockImplementation(() => ({ ...useStateStub, queries: queriesWithOrphan }))

    const sut = render()

    await sut.toggleButton.trigger('click')
    await nextTick()

    expect(sut.baseEventButtons).toHaveLength(useStateStub.suggestionsSearch.value.length)
    expect(sut.slidingPanels).toHaveLength(useStateStub.suggestionsSearch.value.length)

    const buttonTexts = sut.baseEventButtons.map(b => b.text())
    expect(buttonTexts).not.toContain('orphan query (no results)')
  })

  it('should pass the correct props to DisplayEmitter component when there is no query', () => {
    jest.mocked(useGetter).mockImplementation(() => ({ ...useGettersStub, query: ref('') }))

    const sut = render()

    expect(sut.displayEmitter.props().eventMetadata).toStrictEqual({
      feature: 'overview',
      displayOriginalQuery: 'overview-without-query',
      replaceable: false,
    })

    sut.queryDisplayEmitters.forEach(queryDisplayEmitter => {
      expect(queryDisplayEmitter.props().eventMetadata).toStrictEqual({
        feature: 'overview',
        displayOriginalQuery: 'overview-without-query',
        replaceable: false,
      })
    })
  })

  it('should not render the component if isNoResults is true', async () => {
    jest.mocked(useState).mockImplementation(() => ({ ...useStateStub, isNoResults: ref(true) }))

    const sut = render()

    expect(sut.overviewWrapper.exists()).toBeFalsy()
  })

  it('should call scrollIntoView when collapsing after being expanded (and not on expand)', async () => {
    const sut = render()

    const scrollSpy = jest.fn()
    ;(Element.prototype as any).scrollIntoView = scrollSpy

    await sut.toggleButton.trigger('click')
    expect(scrollSpy).toHaveBeenCalledTimes(0)

    // Collapse
    await sut.toggleButton.trigger('click')
    expect(scrollSpy).toHaveBeenCalledTimes(1)
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('should animate the suggestion group once', async () => {
    const sut = render()

    await sut.toggleButton.trigger('click')
    await nextTick()

    useStateStub.suggestionsSearch.value.forEach((_, index) => {
      expect(sut.suggestions[index].classes()).toContain('x-ai-overview-result-animation')
      sut.slidingPanels[index]
        .findAll(getDataTestSelector('ai-overview-suggestion-result'))
        .forEach(result => {
          expect(result.classes()).toContain('x-ai-overview-result-animation')
        })
    })

    await sut.toggleButton.trigger('click')
    await nextTick()

    useStateStub.suggestionsSearch.value.forEach((_, index) => {
      expect(sut.suggestions[index].classes()).not.toContain('x-ai-overview-result-animation')
      sut.slidingPanels[index]
        .findAll(getDataTestSelector('ai-overview-suggestion-result'))
        .forEach(result => {
          expect(result.classes()).not.toContain('x-ai-overview-result-animation')
        })
    })
  })

  it('should emit AiOverviewMounted event on mounted', () => {
    render()

    expect(emitMock).toHaveBeenCalledWith('AiOverviewMounted', undefined, {
      feature: 'overview',
    })
  })

  it('auto-expands when autoExpandInSearchNoResults is true and suggestions finish loading with no results', async () => {
    const suggestionsLoadingRef = ref(true)
    jest
      .mocked(useState)
      .mockImplementation(() => ({ ...useStateStub, suggestionsLoading: suggestionsLoadingRef }))

    const sut = render()

    // Initially collapsed
    expect(sut.suggestionsContainer.isVisible()).toBeFalsy()
    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)

    // Set global noResults and finish loading to trigger the watch
    xInstance.noResults = true
    suggestionsLoadingRef.value = false
    await nextTick()

    // Should be expanded automatically
    expect(sut.suggestionsContainer.isVisible()).toBeTruthy()
    expect(sut.gradientBottom.isVisible()).toBeFalsy()
    expect(sut.toggleButton.text()).toBe(propsStub.collapseText)
    expect(sut.chevronDownIcon.classes()).toContain('x-ai-overview-toggle-btn-icon-expanded')

    // It emits the click event with the previous expanded state (false)
    expect(emitMock).toHaveBeenCalledWith('UserClickedAiOverviewExpandButton', false, {
      suggestionText: useStateStub.suggestionText.value,
      toolingDisplayClick: useStateStub.tagging.value?.toolingDisplayClick,
    })
  })

  it('does not auto-expand when autoExpandInSearchNoResults is false even with no results', async () => {
    const suggestionsLoadingRef = ref(true)
    jest
      .mocked(useState)
      .mockImplementation(() => ({ ...useStateStub, suggestionsLoading: suggestionsLoadingRef }))

    const sut = render({ props: { ...propsStub, autoExpandInSearchNoResults: false } })

    // Make conditions true except the prop
    xInstance.noResults = true
    suggestionsLoadingRef.value = false
    await nextTick()

    // Should remain collapsed
    expect(sut.suggestionsContainer.isVisible()).toBeFalsy()
    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-expanded')
  })
})
