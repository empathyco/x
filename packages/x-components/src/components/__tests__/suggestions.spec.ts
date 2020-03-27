import { Facet, Suggestion } from '@empathy/search-types';
import { mount } from '@vue/test-utils';
import Suggestions from '../pure/suggestions.vue';

describe('testing Suggestions component', () => {
  const suggestions: Suggestion[] = [
    {
      facets: [],
      query: 'salt',
      key: 'salt',
      modelName: 'Suggestion'
    },
    {
      facets: [],
      query: 'limes',
      key: 'limes',
      modelName: 'Suggestion'
    },
    {
      facets: [createFacetWithFilter('fruit')],
      query: 'limes',
      key: 'limes',
      modelName: 'Suggestion'
    },
    {
      facets: [createFacetWithFilter('fresh')],
      query: 'limes',
      key: 'limes',
      modelName: 'Suggestion'
    },
    {
      facets: [],
      query: 'beef short ribs',
      key: 'beef short ribs',
      modelName: 'Suggestion'
    }
  ];

  function createFacetWithFilter(category: string): Facet {
    const facet: Facet = {
      modelName: 'Facet',
      filters: [],
      title: 'category'
    };

    facet.filters.push({
      modelName: 'Filter',
      id: `category:${category}`,
      callbackInfo: {},
      children: [],
      count: 10,
      parent: null,
      selected: false,
      title: category,
      value: {
        filter: `category:${category}`
      },
      facet
    });

    return facet;
  }

  it('renders a list of suggestions passed as props', () => {
    const wrapper = mount(Suggestions, {
      propsData: { suggestions }
    });

    expect(wrapper.findAll('li')).toHaveLength(suggestions.length);
    // Expect generated keys to be unique
    const listItemKeys = new Set((wrapper.vm as any).suggestionsKeys);
    expect(listItemKeys.size).toEqual(suggestions.length);
  });

  it('has a default scoped slot to render each suggestion', () => {
    const wrapper = mount(Suggestions, {
      propsData: { suggestions },
      scopedSlots: {
        default({ suggestion }: { suggestion: Suggestion }) {
          return suggestion.query;
        }
      }
    });

    const liWrappers = wrapper.findAll('li');
    suggestions.forEach((suggestion, index) =>
      expect(liWrappers.at(index).element.textContent).toEqual(suggestion.query)
    );
  });
});
