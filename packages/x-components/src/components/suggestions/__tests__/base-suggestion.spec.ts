import { Suggestion } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XPlugin } from '../../../plugins/x-plugin';
import { normalizeString } from '../../../utils/normalize';
import { XEventsTypes } from '../../../wiring/events.types';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { WireMetadata } from '../../../wiring/wiring.types';
import BaseSuggestion from '../base-suggestion.vue';

describe('testing Base Suggestion component', () => {
  const [, localVue] = installNewXPlugin();

  const query = normalizeString('(b<ebé>)');
  const suggestion: Suggestion = {
    query: '(b<ebé>) lloron',
    facets: [],
    key: 'bebe lloron',
    modelName: 'QuerySuggestion'
  };
  const suggestionSelectedEvents: Partial<XEventsTypes> = {
    UserSelectedAQuerySuggestion: suggestion,
    UserTalked: 'belt'
  };
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

  it('emits suggestionSelectedEvent and the default events onclick', async () => {
    const target = expect.objectContaining<Partial<WireMetadata>>({ target: component.element });
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    component.trigger('click');

    await localVue.nextTick();

    expect(spyOn).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', suggestion.query, target);
    expect(spyOn).toHaveBeenNthCalledWith(2, 'UserSelectedASuggestion', suggestion, target);
    expect(spyOn).toHaveBeenNthCalledWith(3, 'UserSelectedAQuerySuggestion', suggestion, target);
    expect(spyOn).toHaveBeenNthCalledWith(4, 'UserTalked', 'belt', target);
  });
});
