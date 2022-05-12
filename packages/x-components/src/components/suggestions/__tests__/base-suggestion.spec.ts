import { BooleanFilter, Facet, Suggestion } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XPlugin } from '../../../plugins/x-plugin';
import { normalizeString } from '../../../utils/normalize';
import { createSuggestionWithFacets } from '../../../__stubs__/base-suggestion-stubs.factory';
import { XEventsTypes } from '../../../wiring/events.types';
import { WireMetadata } from '../../../wiring/wiring.types';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseSuggestion from '../base-suggestion.vue';

function renderBaseSuggestion({
  query = normalizeString('(b<ebé>)'),
  suggestion = createSuggestionWithFacets('(b<ebé>) lloron', 'bebe lloron', 'QuerySuggestion')[0],
  suggestionFacets
}: BaseSuggestionOptions = {}): BaseSuggestionAPI {
  const [, localVue] = installNewXPlugin();

  if (suggestionFacets !== undefined) {
    suggestion.facets = suggestionFacets;
  }

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

  const wireMetadataObject = expect.objectContaining<Partial<WireMetadata>>({
    target: wrapper.element
  });

  return {
    wrapper,
    suggestion,
    query,
    localVue,
    wireMetadataObject
  };
}

describe('testing Base Suggestion component', () => {
  it('passes the prop suggestion to the default slot', () => {
    const { wrapper, suggestion } = renderBaseSuggestion();

    expect(wrapper.element.textContent).toContain(suggestion.query);
  });

  it('passes the prop filter to the default slot', () => {
    const { wrapper, suggestion } = renderBaseSuggestion();

    expect(wrapper.element.textContent).toContain(
      (<BooleanFilter>suggestion.facets[0].filters[0]).label
    );
  });

  it('has suggestion query parts matching query passed as prop retaining accent marks', () => {
    const { wrapper, suggestion, query } = renderBaseSuggestion();
    const matchingPart = wrapper.find(getDataTestSelector('matching-part')).text();

    expect(normalizeString(matchingPart)).toEqual(query);
    expect(suggestion.query).toContain(matchingPart);
  });

  it('sanitizes the matching part of the suggestion query', () => {
    const { wrapper } = renderBaseSuggestion();
    const matchingPartHTML = wrapper.find(getDataTestSelector('matching-part')).element.innerHTML;

    expect(matchingPartHTML).toBe('(b&lt;ebé&gt;)');
  });

  it('does not have matched query if the query prop is empty', () => {
    const { wrapper } = renderBaseSuggestion({ query: '' });
    const hasMatchingQuery = (wrapper.vm as any).hasMatchingQuery;

    expect(hasMatchingQuery).toBe(false);
  });

  it('does not have a filter label if the suggestion has no facets', () => {
    const { wrapper, suggestion } = renderBaseSuggestion({ suggestionFacets: [] });
    expect(wrapper.element.textContent!.trim()).toBe(suggestion.query);
  });

  it('emits suggestionSelectedEvent and the default events onclick', async () => {
    const { wrapper, suggestion, localVue, wireMetadataObject: target } = renderBaseSuggestion();
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    wrapper.trigger('click');

    await localVue.nextTick();

    expect(spyOn).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', suggestion.query, target);
    expect(spyOn).toHaveBeenNthCalledWith(2, 'UserSelectedASuggestion', suggestion, target);
    expect(spyOn).toHaveBeenNthCalledWith(3, 'UserSelectedAQuerySuggestion', suggestion, target);
    expect(spyOn).toHaveBeenNthCalledWith(4, 'UserTalked', 'belt', target);
  });

  it('emits UserClickedAFilter if the suggestion has a filter', async () => {
    const { wrapper, wireMetadataObject: target, localVue, suggestion } = renderBaseSuggestion();
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    wrapper.trigger('click');

    await localVue.nextTick();

    expect(spyOn).toHaveBeenCalledWith(
      'UserClickedAFilter',
      suggestion.facets[0].filters[0],
      target
    );
  });

  it('does not emit UserClickedAFilter if there is no filter', async () => {
    const { wrapper, suggestion, localVue, wireMetadataObject: target } = renderBaseSuggestion();
    await wrapper.setProps({ suggestion: { ...suggestion, facets: [] } });
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    wrapper.trigger('click');

    await localVue.nextTick();

    expect(spyOn).not.toHaveBeenCalledWith(
      'UserClickedAFilter',
      suggestion.facets[0].filters[0],
      target
    );
  });
});

interface BaseSuggestionOptions {
  query?: string;
  suggestion?: Suggestion;
  suggestionFacets?: Facet[];
}

interface BaseSuggestionAPI {
  wrapper: Wrapper<Vue>;
  suggestion: Suggestion;
  query: string;
  localVue: typeof Vue;
  wireMetadataObject: Partial<WireMetadata>;
}
