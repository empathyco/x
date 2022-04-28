import { BooleanFilter, Suggestion } from '@empathyco/x-types';
import { mount, WrapperArray, Wrapper } from '@vue/test-utils';
import { getPopularSearchesStub } from '../../../__stubs__/index';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseSuggestions from '../base-suggestions.vue';

describe('testing Base Suggestions component', () => {
  const suggestions = getPopularSearchesStub();
  const suggestionWithFacets: Suggestion = {
    facets: [
      {
        id: 'rootCategories',
        label: 'rootCategories',
        modelName: 'SimpleFacet',
        filters: <Array<BooleanFilter>>[
          {
            facetId: 'rootCategories',
            id: '{!tag=rootFilter}rootCategories_60361120_64009600:"DORMIR"',
            label: 'DORMIR',
            selected: false,
            totalResults: 60,
            modelName: 'SimpleFilter'
          },
          {
            facetId: 'rootCategories',
            id: '{!tag=rootFilter}rootCategories_60361120_64009600:"SPECIAL PRICES"',
            label: 'SPECIAL PRICES',
            selected: false,
            totalResults: 24,
            modelName: 'SimpleFilter'
          }
        ]
      }
    ],
    key: 'testQuery',
    query: 'testQuery',
    totalResults: 10,
    results: [],
    modelName: 'PopularSearch'
  };

  it('renders a list of suggestions passed as props', () => {
    const wrapper = mount(BaseSuggestions, {
      propsData: { suggestions }
    });

    expect(wrapper.findAll('li')).toHaveLength(suggestions.length);
    // Expect generated keys to be unique
    const listItemKeys = new Set((wrapper.vm as any).suggestionsKeys);
    expect(listItemKeys.size).toEqual(suggestions.length);
  });

  it('has a default scoped slot to render each suggestion', () => {
    const wrapper = mount(BaseSuggestions, {
      propsData: { suggestions },
      scopedSlots: {
        default({ suggestion, index }: { suggestion: Suggestion; index: number }) {
          return `${index} - ${suggestion.query}`;
        }
      }
    });

    const liWrappers = wrapper.findAll('li');
    suggestions.forEach((suggestion, index) =>
      expect(liWrappers.at(index).element.textContent).toEqual(`${index} - ${suggestion.query}`)
    );
  });

  it('renders at most the number of suggestions defined by `maxItemsToRender` prop', async () => {
    const wrapper = mount(BaseSuggestions, {
      propsData: { suggestions }
    });
    const renderedSuggestions = (): WrapperArray<Vue> =>
      findTestDataById(wrapper, 'suggestion-item');

    expect(renderedSuggestions()).toHaveLength(suggestions.length);

    await wrapper.setProps({ maxItemsToRender: suggestions.length - 1 });
    expect(renderedSuggestions()).toHaveLength(suggestions.length - 1);

    await wrapper.setProps({ maxItemsToRender: suggestions.length });
    expect(renderedSuggestions()).toHaveLength(suggestions.length);

    await wrapper.setProps({ maxItemsToRender: suggestions.length + 1 });
    expect(renderedSuggestions()).toHaveLength(suggestions.length);
  });

  it('renders all suggestions filters if showFacets is true', () => {
    const wrapper = mount(BaseSuggestions, {
      propsData: {
        suggestions: [suggestionWithFacets],
        showFacets: true
      },
      scopedSlots: {
        default({ suggestion, showFacets }: { suggestion: Suggestion; showFacets: boolean }) {
          const filterLabel = (<BooleanFilter>suggestion.facets[0].filters[0]).label;
          return showFacets ? `${suggestion.query} - ${filterLabel}` : `${suggestion.query}`;
        }
      }
    });
    const data = findTestDataById(wrapper, 'suggestion-item');
    expect(data).toHaveLength(2);
    expect(data.at(0).element.textContent).toEqual('testQuery - DORMIR');
    expect(data.at(1).element.textContent).toEqual('testQuery - SPECIAL PRICES');
  });

  it("won't render suggestions with filters if showFacets is false", () => {
    const wrapper = mount(BaseSuggestions, {
      propsData: {
        suggestions: [suggestionWithFacets],
        showFacets: false
      },
      scopedSlots: {
        default({ suggestion }: { suggestion: Suggestion }) {
          expect(suggestion.facets).toHaveLength(0);
          return `${suggestion.query}`;
        }
      }
    });
    const data = findTestDataById(wrapper, 'suggestion-item');
    expect(data).toHaveLength(1);
    expect(data.at(0).element.textContent).toEqual('testQuery');
  });

  it('shows the query as well as the suggestion including facets', () => {
    const wrapper = mount(BaseSuggestions, {
      propsData: {
        showFacets: true,
        showQuery: true,
        suggestions: [suggestionWithFacets]
      },
      scopedSlots: {
        default({ suggestion }: { suggestion: Suggestion }) {
          return `${suggestion.query}${
            suggestion.facets.length ? (<BooleanFilter>suggestion.facets[0].filters[0]).label : ''
          }`;
        }
      }
    });
    const data = findTestDataById(wrapper, 'suggestion-item');
    expect(data).toHaveLength(3);
    expect(data.at(2).element.textContent).toEqual(suggestionWithFacets.query);
  });

  function findTestDataById(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
    return wrapper.findAll(getDataTestSelector(testDataId));
  }
});
