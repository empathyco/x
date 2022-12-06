import { Suggestion } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import {
  createPopularSearch,
  getPopularSearchesStub
} from '../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseSuggestions from '../base-suggestions.vue';
import { createSimpleFacetStub } from '../../../__stubs__/facets-stubs.factory';

function renderBaseSuggestions({
  defaultSlot = '',
  template = `<BaseSuggestions v-bind="$attrs">
                  <template #default="{ suggestion, index, filter }">
                    ${defaultSlot ?? ''}
                  </template>
                </BaseSuggestions>`,
  suggestions = getPopularSearchesStub(),
  showFacets = false,
  showPlainSuggestion = false
}: BaseSuggestionsOptions = {}): BaseSuggestionsAPI {
  const wrapper = mount(
    {
      template,
      components: {
        BaseSuggestions
      }
    },
    {
      propsData: { suggestions, showFacets, showPlainSuggestion }
    }
  );

  return {
    wrapper: wrapper.findComponent(BaseSuggestions),
    suggestions,
    getSuggestionsWrappers() {
      return wrapper.findAll(getDataTestSelector('suggestion-item')).wrappers;
    }
  };
}

describe('testing Base Suggestions component', () => {
  it('renders the passed suggestions', () => {
    const { wrapper, suggestions, getSuggestionsWrappers } = renderBaseSuggestions();

    expect(getSuggestionsWrappers()).toHaveLength(suggestions.length);
    // Expect generated keys to be unique
    const listItemKeys = new Set((wrapper.vm as any).suggestionsKeys);
    expect(listItemKeys.size).toEqual(suggestions.length);
  });

  it('renders the content passed to the default slot', () => {
    const { suggestions, getSuggestionsWrappers } = renderBaseSuggestions({
      defaultSlot: '<span>{{ index }} - {{ suggestion.query}}</span>'
    });
    getSuggestionsWrappers().forEach((suggestionItemWrapper, index) =>
      expect(suggestionItemWrapper.text()).toEqual(`${index} - ${suggestions[index].query}`)
    );
  });

  // eslint-disable-next-line max-len
  it('renders at most the number of suggestions defined by `maxItemsToRender` prop, including those with facets', async () => {
    const { wrapper, getSuggestionsWrappers } = renderBaseSuggestions({
      defaultSlot: `<span>{{suggestion.query}}{{filter ?  ' - ' + filter.label : ''}}</span>`,
      showFacets: true,
      showPlainSuggestion: true,
      suggestions: [
        createPopularSearch('t-shirt', {
          facets: [
            createSimpleFacetStub('category', createFilter => [
              createFilter('man'),
              createFilter('woman')
            ])
          ]
        }),
        createPopularSearch('jeans')
      ]
    });

    const suggestionsWrappers = getSuggestionsWrappers();
    expect(suggestionsWrappers).toHaveLength(4);
    expect(suggestionsWrappers[0].text()).toEqual('t-shirt');
    expect(suggestionsWrappers[1].text()).toEqual('t-shirt - man');
    expect(suggestionsWrappers[2].text()).toEqual('t-shirt - woman');
    expect(suggestionsWrappers[3].text()).toEqual('jeans');

    await wrapper.setProps({ maxItemsToRender: 2 });
    const updatedSuggestionsWrappers = getSuggestionsWrappers();
    expect(updatedSuggestionsWrappers).toHaveLength(2);
    expect(updatedSuggestionsWrappers[0].text()).toEqual('t-shirt');
    expect(updatedSuggestionsWrappers[1].text()).toEqual('t-shirt - man');

    await wrapper.setProps({ maxItemsToRender: 0 });
    expect(getSuggestionsWrappers()).toHaveLength(0);
  });

  it('renders suggestions without facets when `showFacets` is false', () => {
    const suggestions = [
      createPopularSearch('t-shirt', {
        facets: [
          createSimpleFacetStub('category', createFilter => [
            createFilter('woman'),
            createFilter('man')
          ])
        ]
      }),
      createPopularSearch('jeans', {
        facets: [
          createSimpleFacetStub('category', createFilter => [
            createFilter('kids'),
            createFilter('adults')
          ])
        ]
      })
    ];

    const { getSuggestionsWrappers } = renderBaseSuggestions({
      defaultSlot: "<span>{{ suggestion.query }} {{ filter?.label ?? '' }}</span>",
      suggestions
    });
    const suggestionsWrappers = getSuggestionsWrappers();

    expect(suggestionsWrappers).toHaveLength(2);
    suggestionsWrappers.forEach((suggestionWrapper, index) => {
      expect(suggestionWrapper.text()).toBe(suggestions[index].query);
    });
  });

  // eslint-disable-next-line max-len
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
              createFilter('woman')
            ])
          ]
        }),
        createPopularSearch('jeans', {
          facets: [
            createSimpleFacetStub('category', createFilter => [
              createFilter('kids'),
              createFilter('adults')
            ])
          ]
        })
      ]
    });

    const suggestionsWrappers = getSuggestionsWrappers();
    expect(suggestionsWrappers).toHaveLength(6);
    expect(suggestionsWrappers[0].text()).toEqual('t-shirt');
    expect(suggestionsWrappers[1].text()).toEqual('t-shirt - man');
    expect(suggestionsWrappers[2].text()).toEqual('t-shirt - woman');
    expect(suggestionsWrappers[3].text()).toEqual('jeans');
    expect(suggestionsWrappers[4].text()).toEqual('jeans - kids');
    expect(suggestionsWrappers[5].text()).toEqual('jeans - adults');
  });
});

/**
 * The options for the `renderBaseSuggestions` function.
 */
interface BaseSuggestionsOptions {
  /** Default slot content. */
  defaultSlot?: string;
  /** Component template to render. */
  template?: string;
  /** List of suggestions to render. */
  suggestions?: Suggestion[];
  /** Flag to indicate if facets should be rendered. */
  showFacets?: boolean;
  /** Flag to indicate if a suggestion with filters should be rendered. */
  showPlainSuggestion?: boolean;
}

/**
 * Test API for the {@link BaseSuggestions} component.
 */
interface BaseSuggestionsAPI {
  /** The wrapper for base suggestions component. */
  wrapper: Wrapper<Vue>;
  /** The rendered suggestions. */
  suggestions: Suggestion[];
  /** The wrappers of the rendered suggestions. */
  getSuggestionsWrappers: () => Wrapper<Vue>[];
}
