import { Suggestion } from '@empathyco/x-types';
import { mount } from '@vue/test-utils';
import { createQuerySuggestion } from '../../../__stubs__/index';
import { normalizeString } from '../../../utils/normalize';
import { XEventsTypes } from '../../../wiring/events.types';
import { WireMetadata } from '../../../wiring/wiring.types';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseSuggestion from '../base-suggestion.vue';
import { createSimpleFacetStub } from '../../../__stubs__/facets-stubs.factory';
import { createPopularSearch } from '../../../__stubs__/popular-searches-stubs.factory';
import { XPlugin } from '../../../plugins/index';

function renderBaseSuggestion({
  query = 'bebe',
  suggestion = createPopularSearch('bebe lloron'),
  suggestionSelectedEvents = {}
}: BaseSuggestionOptions = {}) {
  const wrapper = mount(
    {
      components: { BaseSuggestion },
      props: ['query', 'suggestion', 'suggestionSelectedEvents'],
      template:
        '<BaseSuggestion :query="query" :suggestion="suggestion" ' +
        ':suggestion-selected-events="suggestionSelectedEvents" />'
    },
    {
      global: { plugins: [installNewXPlugin()] },
      props: {
        query,
        suggestion,
        suggestionSelectedEvents
      }
    }
  );

  const emit = jest.spyOn(XPlugin.bus, 'emit');

  const wireMetadata = expect.objectContaining<Partial<WireMetadata>>({
    target: wrapper.element
  });

  return {
    wrapper,
    suggestion,
    query,
    wireMetadata,
    emit,
    getEndingPart() {
      return wrapper.get(getDataTestSelector('highlight-end'));
    },
    getMatchingPart() {
      return wrapper.get(getDataTestSelector('matching-part'));
    }
  };
}

describe('testing Base Suggestion component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a basic suggestion', () => {
    const { wrapper } = renderBaseSuggestion({
      suggestion: createPopularSearch('milk')
    });

    expect(wrapper.text()).toEqual('milk');
  });

  it('renders a suggestion with a filter', () => {
    const { wrapper } = renderBaseSuggestion({
      suggestion: createPopularSearch('t-shirt', {
        facets: [createSimpleFacetStub('category', createFilter => [createFilter('woman')])]
      })
    });

    // The text content ignores spaces between nodes due to the `condense` option.
    // Fortunately browsers handle this properly.
    expect(wrapper.text()).toEqual('t-shirtwoman');
  });

  it('has suggestion query parts matching query passed as prop retaining accent marks', () => {
    const { wrapper, suggestion, query } = renderBaseSuggestion({
      suggestion: createPopularSearch('bebé lloron')
    });
    const matchingPart = wrapper.find(getDataTestSelector('matching-part')).text();

    expect(normalizeString(matchingPart)).toEqual(query);
    expect(suggestion.query).toContain(matchingPart);
  });

  it('sanitizes the matching part of the suggestion query', () => {
    const { wrapper } = renderBaseSuggestion({
      query: '(b<ebe>)',
      suggestion: createPopularSearch('(b<ebé>) lloron')
    });
    const matchingPartHTML = wrapper.find(getDataTestSelector('matching-part')).element.innerHTML;

    expect(matchingPartHTML).toBe('(b&lt;ebé&gt;)');
  });

  it('emits suggestionSelectedEvent and the default events onclick', () => {
    const customSuggestion = createPopularSearch('bebe lloron');
    const { emit, wrapper, suggestion, wireMetadata } = renderBaseSuggestion({
      suggestion: customSuggestion,
      suggestionSelectedEvents: {
        UserSelectedAQuerySuggestion: customSuggestion
      }
    });
    wrapper.trigger('click');

    expect(emit).toHaveBeenCalledTimes(3);
    expect(emit).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', suggestion.query, wireMetadata);
    expect(emit).toHaveBeenNthCalledWith(2, 'UserSelectedASuggestion', suggestion, wireMetadata);
    expect(emit).toHaveBeenNthCalledWith(
      3,
      'UserSelectedAQuerySuggestion',
      suggestion,
      wireMetadata
    );
  });

  it('emits UserClickedAFilter if the suggestion has a filter', () => {
    const { emit, wrapper, wireMetadata, suggestion } = renderBaseSuggestion({
      suggestion: createPopularSearch('(b<ebé>) lloron', {
        facets: [
          createSimpleFacetStub('rootCategories', createFilter => [
            createFilter('DORMIR'),
            createFilter('SPECIAL PRICES')
          ]),
          createSimpleFacetStub('exampleFacet', createFilter => [createFilter('EXAMPLE')])
        ]
      })
    });
    wrapper.trigger('click');

    expect(emit).toHaveBeenCalledTimes(3);
    expect(emit).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', suggestion.query, wireMetadata);
    expect(emit).toHaveBeenNthCalledWith(2, 'UserSelectedASuggestion', suggestion, wireMetadata);
    expect(emit).toHaveBeenNthCalledWith(
      3,
      'UserClickedAFilter',
      suggestion.facets?.[0].filters?.[0],
      wireMetadata
    );
  });

  it('highlights the text when a query is passed', () => {
    const { wrapper, getMatchingPart, getEndingPart } = renderBaseSuggestion({
      query: 'pork',
      suggestion: createQuerySuggestion('pork neck')
    });

    expect(wrapper.text()).toEqual('pork neck');
    expect(getMatchingPart().text()).toEqual('pork');
    expect(getEndingPart().text()).toEqual('neck');
  });
});

/**
 * The options to render the {@link BaseSuggestion} component.
 */
interface BaseSuggestionOptions {
  /** The query introduced to find the suggestion. */
  query?: string;
  /** The suggestion to be rendered. By default, a suggestion with facets is used. */
  suggestion?: Suggestion;
  /** The events to emit when selecting a suggestion. */
  suggestionSelectedEvents?: Partial<XEventsTypes>;

  template?: string;
}
