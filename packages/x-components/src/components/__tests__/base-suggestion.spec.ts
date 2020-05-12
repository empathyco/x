import { Suggestion } from '@empathy/search-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { normalizeString } from '../../utils/normalize';
import { XEventsTypes } from '../../wiring/events.types';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import BaseSuggestion from '../base-suggestion.vue';

describe('testing Base Suggestion component', () => {
  const [, localVue] = installNewXPlugin();

  const query = normalizeString('bebé');
  const suggestion: Suggestion = {
    query: 'bebe lloron',
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

  it('has suggestion query parts matching the query passed as prop', () => {
    expect(component.find(getDataTestSelector('matching-part')).element.textContent).toEqual(query);
  });

  it('does not have matched query if the query prop is empty', () => {
    component.setProps({ query: '' });
    const hasMatchingQuery = (component.vm as any).hasMatchingQuery;

    expect(hasMatchingQuery).toBe(false);
  });

  it('emits suggestionSelectedEvent and the default events onclick', async () => {
    const target = { target: component.element };
    const spyOn = jest.spyOn(component.vm.$children[0].$x, 'emit');
    component.trigger('click');

    await localVue.nextTick();

    expect(spyOn).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', suggestion.query, target);
    expect(spyOn).toHaveBeenNthCalledWith(2, 'UserSelectedASuggestion', suggestion, target);
    expect(spyOn).toHaveBeenNthCalledWith(3, 'UserSelectedAQuerySuggestion', suggestion, target);
    expect(spyOn).toHaveBeenNthCalledWith(4, 'UserTalked', 'belt', target);
  });
});
