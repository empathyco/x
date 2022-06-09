import { Suggestion } from '@empathyco/x-types';
import { mount, WrapperArray, Wrapper } from '@vue/test-utils';
import { getPopularSearchesStub } from '../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseSuggestions from '../base-suggestions.vue';
import { createSuggestionWithFacets } from '../../../__stubs__/base-suggestion-stubs.factory';
import { getFlattenFilters } from '../../../x-modules/query-suggestions/components/__tests__/utils';

const suggestionWithFacets = createSuggestionWithFacets('testQuery', 'testQuery', 'PopularSearch');

function renderBaseSuggestions({
  customSlot = '',
  template = `<BaseSuggestions
                :suggestions="suggestions"
                :showFacets="showFacets"
                :appendSuggestionWithoutFilter="appendSuggestionWithoutFilter">
                  <template #default="{suggestion, index}">
                    ${customSlot ?? ''}
                  </template>
                </BaseSuggestions>`,
  suggestions = getPopularSearchesStub(),
  showFacets = false,
  appendSuggestionWithoutFilter = false
}: BaseSuggestionsOptions = {}): BaseSuggestionsAPI {
  const wrapper = mount(
    {
      template,
      components: {
        BaseSuggestions
      },
      props: ['suggestions', 'showFacets', 'appendSuggestionWithoutFilter']
    },
    {
      propsData: { suggestions, showFacets, appendSuggestionWithoutFilter }
    }
  );

  return {
    wrapper: wrapper.findComponent(BaseSuggestions),
    suggestions,
    getSuggestionsItems() {
      return wrapper.findAll(getDataTestSelector('suggestion-item'));
    }
  };
}

describe('testing Base Suggestions component', () => {
  it('renders a list of suggestions passed as props', () => {
    const { wrapper, suggestions, getSuggestionsItems } = renderBaseSuggestions();

    expect(getSuggestionsItems()).toHaveLength(suggestions.length);
    // Expect generated keys to be unique
    const listItemKeys = new Set((wrapper.vm as any).suggestionsKeys);
    expect(listItemKeys.size).toEqual(suggestions.length);
  });

  it('has a default scoped slot to render each suggestion', () => {
    const { suggestions, getSuggestionsItems } = renderBaseSuggestions({
      customSlot: '<span>{{ index }} - {{ suggestion.query}}</span>'
    });
    getSuggestionsItems().wrappers.forEach((suggestionItemWrapper, index) =>
      expect(suggestionItemWrapper.text()).toEqual(`${index} - ${suggestions[index].query}`)
    );
  });

  it('renders at most the number of suggestions defined by `maxItemsToRender` prop', async () => {
    const { wrapper, getSuggestionsItems, suggestions } = renderBaseSuggestions();

    expect(getSuggestionsItems()).toHaveLength(suggestions.length);

    await wrapper.setProps({ maxItemsToRender: suggestions.length - 1 });
    expect(getSuggestionsItems()).toHaveLength(suggestions.length - 1);

    await wrapper.setProps({ maxItemsToRender: suggestions.length });
    expect(getSuggestionsItems()).toHaveLength(suggestions.length);

    await wrapper.setProps({ maxItemsToRender: suggestions.length + 1 });
    expect(getSuggestionsItems()).toHaveLength(suggestions.length);
  });

  // eslint-disable-next-line max-len
  it('renders at most the number of suggestions defined by `maxItemsToRender` prop counting with the facets', async () => {
    const suggestionsWithoutFacets = getPopularSearchesStub();
    const { wrapper, getSuggestionsItems, suggestions } = renderBaseSuggestions({
      customSlot: `<span>{{suggestion.query}}</span>`,
      showFacets: true,
      suggestions: [...suggestionWithFacets, ...getPopularSearchesStub()]
    });

    const filterCount = suggestionWithFacets[0].facets.reduce((acc, act) => {
      return acc + act.filters.length;
    }, 0);

    await wrapper.setProps({ maxItemsToRender: filterCount + 1 });

    expect(getSuggestionsItems()).toHaveLength(suggestions.length);
    expect(getSuggestionsItems().at(-1).text()).toContain(suggestionsWithoutFacets[0].query);
  });

  it('renders all suggestions with facets if showFacets is true', () => {
    const { getSuggestionsItems } = renderBaseSuggestions({
      customSlot:
        '<span>{{ suggestion.query }} - {{ suggestion.facets[0].filters[0].label }}</span>',
      showFacets: true,
      suggestions: suggestionWithFacets
    });
    expect(getSuggestionsItems()).toHaveLength(3);

    const filters = getFlattenFilters(suggestionWithFacets[0]);

    getSuggestionsItems().wrappers.forEach((suggestionItemWrapper, index) =>
      expect(suggestionItemWrapper.text()).toBe(
        `${suggestionWithFacets[0].query} - ${filters[index]}`
      )
    );
  });

  it("won't render suggestions with facets if showFacets is false", () => {
    const { getSuggestionsItems } = renderBaseSuggestions({
      customSlot: '<span>{{ suggestion.query }}{{ suggestion.facets[0] }}</span>',
      showFacets: false,
      suggestions: suggestionWithFacets
    });

    expect(getSuggestionsItems()).toHaveLength(1);
    getSuggestionsItems().wrappers.forEach(suggestionItemWrapper =>
      expect(suggestionItemWrapper.text()).toBe(suggestionWithFacets[0].query)
    );
  });

  it('shows the suggestions with facets and the query itself', () => {
    const { getSuggestionsItems } = renderBaseSuggestions({
      customSlot: '<span>{{ suggestion.query }}{{ suggestion.facets[0]?.filters[0].label }}</span>',
      showFacets: true,
      appendSuggestionWithoutFilter: true,
      suggestions: suggestionWithFacets
    });
    expect(getSuggestionsItems()).toHaveLength(4);
    expect(getSuggestionsItems().wrappers[0].text()).toBe(suggestionWithFacets[0].query);

    const filters = getFlattenFilters(suggestionWithFacets[0]);
    getSuggestionsItems().wrappers.forEach((suggestionItemWrapper, index) => {
      expect(suggestionItemWrapper.text()).toBe(
        index === 0
          ? suggestionWithFacets[0].query
          : `${suggestionWithFacets[0].query}${filters[index - 1]}`
      );
    });
  });
});

/**
 * The options for the `renderBaseSuggestions` function.
 */
interface BaseSuggestionsOptions {
  template?: string;
  suggestions?: Suggestion[];
  showFacets?: boolean;
  appendSuggestionWithoutFilter?: boolean;
  customSlot?: string;
}

/**
 * Test API for the {@link BaseSuggestions} component.
 */
interface BaseSuggestionsAPI {
  wrapper: Wrapper<Vue>;
  suggestions: Suggestion[];
  getSuggestionsItems: () => WrapperArray<Vue>;
}
