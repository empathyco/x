import { BooleanFilter } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XPlugin } from '../../../plugins/x-plugin';
import { normalizeString } from '../../../utils/normalize';
import { createBaseSuggestionWithFacets } from '../../../__stubs__/base-suggestion-stubs.factory';
import { WireMetadata, XEventsTypes } from '../../../wiring/index';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseSuggestion from '../base-suggestion.vue';

describe('testing Base Suggestion component', () => {
  const [, localVue] = installNewXPlugin();

  const query = normalizeString('(b<ebé>)');
  const suggestion = createBaseSuggestionWithFacets(
    '(b<ebé>) lloron',
    'bebe lloron',
    'QuerySuggestion'
  );

  const suggestionSelectedEvents: Partial<XEventsTypes> = {
    UserSelectedAQuerySuggestion: suggestion,
    UserTalked: 'belt'
  };

  const getWireMetadataObject = (component: Wrapper<Vue>): Partial<WireMetadata> =>
    expect.objectContaining<Partial<WireMetadata>>({ target: component.element });

  let component: Wrapper<Vue>;

  beforeEach(() => {
    component = mount(BaseSuggestion, {
      localVue,
      propsData: { query, suggestion, suggestionSelectedEvents }
    });
  });

  it('passes the prop suggestion to the default slot', () => {
    expect(component.element.textContent).toContain(suggestion.query);
  });

  it('passes the prop suggestionFilter to the default slot', () => {
    expect(component.element.textContent).toContain(
      (<BooleanFilter>suggestion.facets[0].filters[0]).label
    );
  });

  it('has suggestion query parts matching query passed as prop retaining accent marks', () => {
    const matchingPart = component.find(getDataTestSelector('matching-part')).text();

    expect(normalizeString(matchingPart)).toEqual(query);
    expect(suggestion.query).toContain(matchingPart);
  });

  it('sanitizes the matching part of the suggestion query', () => {
    const matchingPartHTML = component.find(getDataTestSelector('matching-part')).element.innerHTML;

    expect(matchingPartHTML).toBe('(b&lt;ebé&gt;)');
  });

  it('does not have matched query if the query prop is empty', () => {
    component.setProps({ query: '' });
    const hasMatchingQuery = (component.vm as any).hasMatchingQuery;

    expect(hasMatchingQuery).toBe(false);
  });

  it('does not have a filter label if the suggestion has no facets', async () => {
    await component.setProps({ suggestion: { ...suggestion, facets: [] } });
    expect(component.element.textContent).toBe(suggestion.query)
    );
  });

  it('emits suggestionSelectedEvent and the default events onclick', async () => {
    const target = getWireMetadataObject(component);
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    component.trigger('click');

    await localVue.nextTick();

    expect(spyOn).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', suggestion.query, target);
    expect(spyOn).toHaveBeenNthCalledWith(2, 'UserSelectedASuggestion', suggestion, target);
    expect(spyOn).toHaveBeenNthCalledWith(3, 'UserSelectedAQuerySuggestion', suggestion, target);
    expect(spyOn).toHaveBeenNthCalledWith(4, 'UserTalked', 'belt', target);
  });

  it('emits UserClickedAFilter if the suggestion has a filter', async () => {
    const target = getWireMetadataObject(component);
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    component.trigger('click');

    await localVue.nextTick();

    expect(spyOn).toHaveBeenCalledWith(
      'UserClickedAFilter',
      suggestion.facets[0].filters[0],
      target
    );
  });

  it('does not emit UserClickedAFilter if there is no filter', async () => {
    await component.setProps({ suggestion: { ...suggestion, facets: [] } });
    const target = getWireMetadataObject(component);
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    component.trigger('click');

    await localVue.nextTick();

    expect(spyOn).not.toHaveBeenCalledWith(
      'UserClickedAFilter',
      suggestion.facets[0].filters[0],
      target
    );
  });
});
