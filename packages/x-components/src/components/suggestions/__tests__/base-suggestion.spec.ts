import { Suggestion } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XPlugin } from '../../../plugins/x-plugin';
import { normalizeString } from '../../../utils/normalize';
import { XEventsTypes } from '../../../wiring/events.types';
import { WireMetadata } from '../../../wiring/wiring.types';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseSuggestion from '../base-suggestion.vue';
import { createPopularSearch, createSimpleFacetStub } from '../../../__stubs__';

function renderBaseSuggestion({
  query = 'bebe',
  suggestion = {
    query: 'bebe lloron',
    facets: [],
    key: 'bebe lloron',
    modelName: 'QuerySuggestion'
  }
}: BaseSuggestionOptions = {}): BaseSuggestionAPI {
  const [, localVue] = installNewXPlugin();

  const suggestionSelectedEvents: Partial<XEventsTypes> = {
    UserSelectedAQuerySuggestion: suggestion,
    UserTalked: 'belt'
  };

  const wrapper = mount(BaseSuggestion, {
    localVue,
    propsData: {
      query,
      suggestion,
      suggestionSelectedEvents
    }
  });

  const wireMetadata = expect.objectContaining<Partial<WireMetadata>>({
    target: wrapper.element
  });

  return {
    wrapper,
    suggestion,
    query,
    localVue,
    wireMetadata
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
      suggestion: {
        query: 'bebé lloron',
        facets: [],
        key: 'bebe lloron',
        modelName: 'QuerySuggestion'
      }
    });
    const matchingPart = wrapper.find(getDataTestSelector('matching-part')).text();

    expect(normalizeString(matchingPart)).toEqual(query);
    expect(suggestion.query).toContain(matchingPart);
  });

  it('sanitizes the matching part of the suggestion query', () => {
    const { wrapper } = renderBaseSuggestion({
      query: normalizeString('(b<ebé>)'),
      suggestion: {
        query: '(b<ebé>) lloron',
        facets: [],
        key: 'bebe lloron',
        modelName: 'QuerySuggestion'
      }
    });
    const matchingPartHTML = wrapper.find(getDataTestSelector('matching-part')).element.innerHTML;

    expect(matchingPartHTML).toBe('(b&lt;ebé&gt;)');
  });

  it('does not have a filter label if the suggestion has no facets', () => {
    const { wrapper, suggestion } = renderBaseSuggestion();
    expect(wrapper.text().trim()).toBe(suggestion.query);
  });

  it('emits suggestionSelectedEvent and the default events onclick', async () => {
    const { wrapper, suggestion, localVue, wireMetadata } = renderBaseSuggestion();
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    wrapper.trigger('click');

    await localVue.nextTick();

    expect(spyOn).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', suggestion.query, wireMetadata);
    expect(spyOn).toHaveBeenNthCalledWith(2, 'UserSelectedASuggestion', suggestion, wireMetadata);
    expect(spyOn).toHaveBeenNthCalledWith(
      3,
      'UserSelectedAQuerySuggestion',
      suggestion,
      wireMetadata
    );
    expect(spyOn).toHaveBeenNthCalledWith(4, 'UserTalked', 'belt', wireMetadata);
  });

  it('emits UserClickedAFilter if the suggestion has a filter', async () => {
    const { wrapper, wireMetadata, localVue, suggestion } = renderBaseSuggestion({
      suggestion: {
        query: '(b<ebé>) lloron',
        facets: [
          createSimpleFacetStub('rootCategories', createFilter => [
            createFilter('DORMIR'),
            createFilter('SPECIAL PRICES')
          ]),
          createSimpleFacetStub('exampleFacet', createFilter => [createFilter('EXAMPLE')])
        ],
        key: 'bebe lloron',
        modelName: 'QuerySuggestion'
      }
    });
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    wrapper.trigger('click');

    await localVue.nextTick();

    expect(spyOn).toHaveBeenCalledWith(
      'UserClickedAFilter',
      suggestion.facets[0].filters[0],
      wireMetadata
    );
  });

  it('does not emit UserClickedAFilter if there is no filter', async () => {
    const { wrapper, localVue, wireMetadata } = renderBaseSuggestion();
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    wrapper.trigger('click');

    await localVue.nextTick();

    expect(spyOn).not.toHaveBeenCalledWith('UserClickedAFilter', undefined, wireMetadata);
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
  /** The test Vue instance. */
  localVue: typeof Vue;
  /** Metadata used to keep track of the events fired to the bus. */
  wireMetadata: Partial<WireMetadata>;
}
