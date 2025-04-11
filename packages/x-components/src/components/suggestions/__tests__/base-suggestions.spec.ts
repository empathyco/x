import type { Suggestion } from '@empathyco/x-types'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { createSimpleFacetStub } from '../../../__stubs__/facets-stubs.factory'
import {
  createPopularSearch,
  getPopularSearchesStub,
} from '../../../__stubs__/popular-searches-stubs.factory'
import { getDataTestSelector } from '../../../__tests__/utils'
import BaseSuggestions from '../base-suggestions.vue'

function renderBaseSuggestions({
  defaultSlot = '',
  template = `<BaseSuggestions v-bind="$attrs">
                  <template #default="{ suggestion, index, filter }">
                    ${defaultSlot ?? ''}
                  </template>
                </BaseSuggestions>`,
  suggestions = getPopularSearchesStub(),
  showFacets = false,
  showPlainSuggestion = false,
  suggestionItemClass,
}: BaseSuggestionsOptions = {}): BaseSuggestionsAPI {
  const wrapperContainer = mount(
    {
      template,
      components: {
        BaseSuggestions,
      },
    },
    {
      props: { suggestions, showFacets, showPlainSuggestion, suggestionItemClass },
    },
  )

  const wrapper = wrapperContainer.findComponent(BaseSuggestions)

  return {
    wrapper,
    wrapperContainer,
    suggestions,
    getSuggestionsWrappers() {
      return wrapper.findAll(getDataTestSelector('suggestion-item'))
    },
  }
}

describe('testing Base Suggestions component', () => {
  it('renders the passed suggestions', () => {
    const { suggestions, getSuggestionsWrappers } = renderBaseSuggestions()

    expect(getSuggestionsWrappers()).toHaveLength(suggestions.length)
  })

  it('renders the content passed to the default slot', () => {
    const { suggestions, getSuggestionsWrappers } = renderBaseSuggestions({
      defaultSlot: '<span>{{ index }} - {{ suggestion.query}}</span>',
    })
    getSuggestionsWrappers().forEach((suggestionItemWrapper, index) =>
      expect(suggestionItemWrapper.text()).toEqual(`${index} - ${suggestions[index].query}`),
    )
  })

  it('renders at most the number of suggestions defined by `maxItemsToRender` prop, including those with facets', async () => {
    const { wrapperContainer, getSuggestionsWrappers } = renderBaseSuggestions({
      defaultSlot: `<span>{{suggestion.query}}{{filter ?  ' - ' + filter.label : ''}}</span>`,
      showFacets: true,
      showPlainSuggestion: true,
      suggestions: [
        createPopularSearch('t-shirt', {
          facets: [
            createSimpleFacetStub('category', createFilter => [
              createFilter('man'),
              createFilter('woman'),
            ]),
          ],
        }),
        createPopularSearch('jeans'),
      ],
    })

    const suggestionsWrappers = getSuggestionsWrappers()
    expect(suggestionsWrappers).toHaveLength(4)
    expect(suggestionsWrappers[0].text()).toEqual('t-shirt')
    expect(suggestionsWrappers[1].text()).toEqual('t-shirt - man')
    expect(suggestionsWrappers[2].text()).toEqual('t-shirt - woman')
    expect(suggestionsWrappers[3].text()).toEqual('jeans')

    await wrapperContainer.setProps({ maxItemsToRender: 2 })
    const updatedSuggestionsWrappers = getSuggestionsWrappers()
    expect(updatedSuggestionsWrappers).toHaveLength(2)
    expect(updatedSuggestionsWrappers[0].text()).toEqual('t-shirt')
    expect(updatedSuggestionsWrappers[1].text()).toEqual('t-shirt - man')

    await wrapperContainer.setProps({ maxItemsToRender: 0 })
    expect(getSuggestionsWrappers()).toHaveLength(0)
  })

  it('renders suggestions without facets when `showFacets` is false', () => {
    const suggestions = [
      createPopularSearch('t-shirt', {
        facets: [
          createSimpleFacetStub('category', createFilter => [
            createFilter('woman'),
            createFilter('man'),
          ]),
        ],
      }),
      createPopularSearch('jeans', {
        facets: [
          createSimpleFacetStub('category', createFilter => [
            createFilter('kids'),
            createFilter('adults'),
          ]),
        ],
      }),
    ]

    const { getSuggestionsWrappers } = renderBaseSuggestions({
      defaultSlot: "<span>{{ suggestion.query }} {{ filter?.label ?? '' }}</span>",
      suggestions,
    })
    const suggestionsWrappers = getSuggestionsWrappers()

    expect(suggestionsWrappers).toHaveLength(2)
    suggestionsWrappers.forEach((suggestionWrapper, index) => {
      expect(suggestionWrapper.text()).toBe(suggestions[index].query)
    })
  })

  it('renders the plain suggestion when `showFacets` and `showPlainSuggestion` are set to true', () => {
    const { getSuggestionsWrappers } = renderBaseSuggestions({
      defaultSlot: `<span>{{suggestion.query}}{{filter ?  ' - ' + filter.label : ''}}</span>`,
      showFacets: true,
      showPlainSuggestion: true,
      suggestions: [
        createPopularSearch('t-shirt', {
          facets: [
            createSimpleFacetStub('category', createFilter => [
              createFilter('man'),
              createFilter('woman'),
            ]),
          ],
        }),
        createPopularSearch('jeans', {
          facets: [
            createSimpleFacetStub('category', createFilter => [
              createFilter('kids'),
              createFilter('adults'),
            ]),
          ],
        }),
      ],
    })

    const suggestionsWrappers = getSuggestionsWrappers()
    expect(suggestionsWrappers).toHaveLength(6)
    expect(suggestionsWrappers[0].text()).toEqual('t-shirt')
    expect(suggestionsWrappers[1].text()).toEqual('t-shirt - man')
    expect(suggestionsWrappers[2].text()).toEqual('t-shirt - woman')
    expect(suggestionsWrappers[3].text()).toEqual('jeans')
    expect(suggestionsWrappers[4].text()).toEqual('jeans - kids')
    expect(suggestionsWrappers[5].text()).toEqual('jeans - adults')
  })

  it('allows to add classes to the `suggestion item`', () => {
    const { getSuggestionsWrappers } = renderBaseSuggestions({
      suggestionItemClass: 'custom-class',
    })
    getSuggestionsWrappers().forEach(suggestionWrapper => {
      expect(suggestionWrapper.classes('custom-class')).toBe(true)
    })
  })
})

/**
 * The options for the `renderBaseSuggestions` function.
 */
interface BaseSuggestionsOptions {
  /** Default slot content. */
  defaultSlot?: string
  /** Component template to render. */
  template?: string
  /** List of suggestions to render. */
  suggestions?: Suggestion[]
  /** Flag to indicate if facets should be rendered. */
  showFacets?: boolean
  /** Flag to indicate if a suggestion with filters should be rendered. */
  showPlainSuggestion?: boolean
  /** Class to add to the node wrapping the suggestion item. */
  suggestionItemClass?: string
}

/**
 * Test API for the {@link BaseSuggestions} component.
 */
interface BaseSuggestionsAPI {
  /** The wrapper for base suggestions component. */
  wrapper: VueWrapper
  /** The wrapper container for the mounted component. */
  wrapperContainer: VueWrapper
  /** The rendered suggestions. */
  suggestions: Suggestion[]
  /** The wrappers of the rendered suggestions. */
  getSuggestionsWrappers: () => DOMWrapper<Element>[]
}
