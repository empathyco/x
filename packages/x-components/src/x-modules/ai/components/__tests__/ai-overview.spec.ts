import type { ComponentMountingOptions } from '@vue/test-utils'
import type { Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory'
import { getDataTestSelector } from '../../../../__tests__/utils'
import {
  AIStarIcon,
  ArrowRightIcon,
  BaseEventButton,
  ChevronDownIcon,
  SlidingPanel,
} from '../../../../components'
import { useGetter, useState } from '../../../../composables'
import AIOverview from '../ai-overview.vue'

jest.mock('../../../../composables')

const useGettersStub = {
  query: ref('query text'),
}
const useStateStub = {
  suggestionText: ref('suggestion text'),
  responseText: ref('response text'),
  suggestionsSearch: ref([
    { query: 'suggestion 1', results: getResultsStub() },
    { query: 'suggestion 2', results: getResultsStub() },
    { query: 'suggestion 3', results: getResultsStub() },
  ]),
  queries: ref([{ query: 'suggestion 1' }, { query: 'suggestion 2' }, { query: 'suggestion 3' }]),
  params: ref({ param1: 'value1', param2: 'value2' }),
  suggestionsLoading: ref(false),
}
const useGettersMock = jest.fn(() => useGettersStub)
const useStateMock = jest.fn(() => useStateStub)

const propsStub = {
  title: 'Empathy AI Overview',
  titleLoading: 'Loading AI Overview',
  expandText: 'Show more',
  collapseText: 'Show less',
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
  })

  return {
    wrapper,
    get titleLoading() {
      return wrapper.find(getDataTestSelector('ai-overview-title-loading'))
    },
    get titleLoadingText() {
      return wrapper.find(getDataTestSelector('ai-overview-title-loading-text'))
    },
    get title() {
      return wrapper.find(getDataTestSelector('ai-overview-title'))
    },
    get aiStarIcon() {
      return wrapper.findComponent(AIStarIcon)
    },
    get loadingContent() {
      return wrapper.find(getDataTestSelector('ai-overview-loading-content'))
    },
    get loadingItems() {
      return wrapper.findAll(getDataTestSelector('ai-overview-loading-item'))
    },
    get content() {
      return wrapper.find(getDataTestSelector('ai-overview-content'))
    },
    get collapseHeightSuggestions() {
      return wrapper.findComponent(getDataTestSelector('ai-overview-collapse-height-suggestions'))
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
    get gradientBottom() {
      return wrapper.find(getDataTestSelector('ai-overview-gradient'))
    },
    get toggleButton() {
      return wrapper.find(getDataTestSelector('ai-overview-toggle-button'))
    },
    get chevronDownIcon() {
      return wrapper.findComponent(ChevronDownIcon)
    },
  }
}

describe('ai-overview component', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
    jest.mocked(useGetter).mockImplementation(useGettersMock)
    jest.mocked(useState).mockImplementation(useStateMock)
  })

  it('should render the component by default', () => {
    const sut = render()

    expect(sut.titleLoading.exists()).toBeFalsy()
    expect(sut.title.exists()).toBeTruthy()
    expect(sut.title.text()).toBe(propsStub.title)
    expect(sut.aiStarIcon.exists()).toBeTruthy()
    expect(sut.loadingContent.exists()).toBeFalsy()
    expect(sut.content.exists()).toBeTruthy()
    expect(sut.content.text()).toContain(useStateStub.suggestionText.value)
    expect(sut.content.text()).toContain(useStateStub.responseText.value)
    expect(sut.collapseHeightSuggestions.exists()).toBeTruthy()
    expect(sut.collapseHeightSuggestions.attributes().style).toBe(
      `--x-collapse-height-transition-duration: ${300 * useStateStub.suggestionsSearch.value.length}ms;`,
    )
    expect(sut.suggestionsContainer.isVisible()).toBeFalsy()
    expect(sut.baseEventButtons).toHaveLength(useStateStub.suggestionsSearch.value.length)
    expect(sut.slidingPanels).toHaveLength(useStateStub.suggestionsSearch.value.length)
    expect(sut.arrowRightIcons).toHaveLength(useStateStub.suggestionsSearch.value.length)

    useStateStub.suggestionsSearch.value.forEach((suggestionSearch, index) => {
      expect(sut.baseEventButtons[index].text()).toBe(suggestionSearch.query)
      expect(sut.baseEventButtons[index].props('events')).toStrictEqual({
        UserAcceptedAQuery: suggestionSearch.query,
      })
      expect(sut.slidingPanels[index].props('resetOnContentChange')).toBeFalsy()

      const results = sut.slidingPanels[index].findAll(
        getDataTestSelector('ai-overview-suggestion-result'),
      )

      expect(results).toHaveLength(suggestionSearch.results.length)
    })

    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)
    expect(sut.chevronDownIcon.exists()).toBeTruthy()
    expect(sut.chevronDownIcon.classes()).toContain('x-ai-overview-toggle-btn-icon-collapsed')
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
    expect(sut.content.exists()).toBeFalsy()
    expect(sut.loadingContent.exists()).toBeTruthy()
    expect(sut.loadingItems).toHaveLength(4)
  })

  it('should render with expanded state correctly', async () => {
    const sut = render()

    expect(sut.suggestionsContainer.isVisible()).toBeFalsy()
    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)
    expect(sut.chevronDownIcon.classes()).toContain('x-ai-overview-toggle-btn-icon-collapsed')
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-expanded')

    await sut.toggleButton.trigger('click')

    expect(sut.suggestionsContainer.isVisible()).toBeTruthy()
    expect(sut.gradientBottom.isVisible()).toBeFalsy()
    expect(sut.toggleButton.text()).toBe(propsStub.collapseText)
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-collapsed')
    expect(sut.chevronDownIcon.classes()).toContain('x-ai-overview-toggle-btn-icon-expanded')
  })

  it('should collapse the suggestions when the query changes', async () => {
    const sut = render()

    await sut.toggleButton.trigger('click')

    expect(sut.suggestionsContainer.isVisible()).toBeTruthy()
    expect(sut.gradientBottom.isVisible()).toBeFalsy()
    expect(sut.toggleButton.text()).toBe(propsStub.collapseText)
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-collapsed')
    expect(sut.chevronDownIcon.classes()).toContain('x-ai-overview-toggle-btn-icon-expanded')

    useGettersStub.query.value = 'new query text'
    await sut.wrapper.vm.$nextTick()

    expect(sut.suggestionsContainer.isVisible()).toBeFalsy()
    expect(sut.gradientBottom.isVisible()).toBeTruthy()
    expect(sut.toggleButton.text()).toBe(propsStub.expandText)
    expect(sut.chevronDownIcon.classes()).toContain('x-ai-overview-toggle-btn-icon-collapsed')
    expect(sut.chevronDownIcon.classes()).not.toContain('x-ai-overview-toggle-btn-icon-expanded')
  })

  it('should render correctly if suggestion queries is empty', () => {
    jest.mocked(useState).mockImplementation(() => ({ ...useStateStub, queries: ref([]) }))

    const sut = render()

    expect(sut.suggestionsContainer.exists()).toBeFalsy()
    expect(sut.toggleButton.isVisible()).toBeFalsy()
    expect(sut.gradientBottom.isVisible()).toBeFalsy()
  })
})
