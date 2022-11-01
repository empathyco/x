import { Suggestion } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XPlugin } from '../../../plugins/x-plugin';
import { normalizeString } from '../../../utils/normalize';
import { WireMetadata } from '../../../wiring/wiring.types';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseSuggestion from '../base-suggestion.vue';
import { createSimpleFacetStub } from '../../../__stubs__/facets-stubs.factory';
import { createPopularSearch } from '../../../__stubs__/popular-searches-stubs.factory';

function renderBaseSuggestion({
  query = 'bebe',
  suggestion = createPopularSearch('bebe lloron')
}: BaseSuggestionOptions = {}): BaseSuggestionAPI {
  const [, localVue] = installNewXPlugin();
  const emit = jest.spyOn(XPlugin.bus, 'emit');
  const wrapper = mount(BaseSuggestion, {
    localVue,
    propsData: {
      query,
      suggestion,
      suggestionSelectedEvents: {
        UserSelectedAQuerySuggestion: suggestion
      }
    }
  });

  const wireMetadata = expect.objectContaining<Partial<WireMetadata>>({
    target: wrapper.element
  });

  return {
    wrapper,
    suggestion,
    query,
    wireMetadata,
    emit
  };
}

describe('testing Base Suggestion component', () => {
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

    expect(wrapper.text()).toEqual('t-shirt woman');
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
    const { emit, wrapper, suggestion, wireMetadata } = renderBaseSuggestion();
    wrapper.trigger('click');

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
    expect(emit).toHaveBeenCalledWith(
      'UserClickedAFilter',
      suggestion.facets?.[0].filters?.[0],
      wireMetadata
    );
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
}

/**
 * Test API for the {@link BaseSuggestion} component.
 */
interface BaseSuggestionAPI {
  /** The wrapper for base suggestion component. */
  wrapper: Wrapper<Vue>;
  /** The rendered suggestion. */
  suggestion: Suggestion;
  /** The query introduced to find the suggestion. */
  query: string;
  /** Metadata used to keep track of the events fired to the bus. */
  wireMetadata: Partial<WireMetadata>;
  /** Mock for the `$x.emit` function. Can be used to check the emitted events. */
  emit: jest.SpyInstance;
}
