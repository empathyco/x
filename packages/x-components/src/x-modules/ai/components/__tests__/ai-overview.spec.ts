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
}
const emitMock = jest.fn()
const useGettersMock = jest.fn(() => useGettersStub)
const useStateMock = jest.fn(() => useStateStub)
const use$xMock = jest.fn(() => ({ emit: emitMock }))

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
          props: ['payload', 'eventMetadata'],
        },
      },
    },
  })

  return {
    wrapper,
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
  }
}

//TODO: Add the remaining tests
describe('ai-overview component', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
    jest.mocked(useGetter).mockImplementation(useGettersMock)
    jest.mocked(useState).mockImplementation(useStateMock)
    jest.mocked(use$x).mockImplementation(use$xMock as any)
  })

  it('should render the component by default', () => {
    const sut = render()

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

    useStateStub.suggestionsSearch.value.forEach((suggestionSearch, index) => {
      expect(sut.queryDisplayEmitters[index].props().eventMetadata).toStrictEqual({
        feature: 'overview',
        displayOriginalQuery: useGettersStub.query.value,
        replaceable: false,
      })
      expect(sut.queryDisplayEmitters[index].props().payload).toStrictEqual(
        useStateStub.tagging.value.searchQueries[suggestionSearch.query].toolingDisplay,
      )
      expect(sut.baseEventButtons[index].text()).toBe(suggestionSearch.query)
      expect(sut.baseEventButtons[index].props().events).toStrictEqual({
        UserAcceptedAQuery: suggestionSearch.query,
      })
      expect(sut.slidingPanels[index].props('resetOnContentChange')).toBeFalsy()
      expect(sut.slidingPanels[index].props('scrollContainerClass')).toBe(
        propsStub.slidingPanelContainersClasses,
      )
      expect(sut.slidingPanels[index].props('buttonClass')).toBe(
        propsStub.slidingPanelButtonsClasses,
      )
      expect(sut.slidingPanels[index].classes()).toContain(propsStub.slidingPanelsClasses)
      const results = sut.slidingPanels[index].findAll(
        getDataTestSelector('ai-overview-suggestion-result'),
      )

      expect(results).toHaveLength(suggestionSearch.results.length)
    })

    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)
    expect(sut.chevronDownIcon.exists()).toBeTruthy()
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-expanded')
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

  it('should collapse the suggestions when the query changes', async () => {
    const sut = render()

    await sut.toggleButton.trigger('click')

    expect(sut.suggestionsContainer.isVisible()).toBeTruthy()
    expect(sut.gradientBottom.isVisible()).toBeFalsy()
    expect(sut.toggleButton.text()).toBe(propsStub.collapseText)
    expect(sut.chevronDownIcon.classes()).toContain('x-ai-overview-toggle-btn-icon-expanded')

    useGettersStub.query.value = 'new query text'
    await sut.wrapper.vm.$nextTick()

    expect(sut.suggestionsContainer.isVisible()).toBeFalsy()
    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-expanded')
  })

  it('should emit event when toggle button is clicked and suggestions are not expanded', async () => {
    const sut = render()

    await sut.toggleButton.trigger('click')

    expect(sut.suggestionsContainer.isVisible()).toBeTruthy()

    expect(emitMock).toHaveBeenNthCalledWith(1, 'UserClickedAiOverviewExpandButton', false, {
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
})
