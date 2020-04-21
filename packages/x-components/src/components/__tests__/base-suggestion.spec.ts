import { Suggestion } from '@empathy/search-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XPlugin } from '../../plugins/x-plugin';
import { normalizeString } from '../../utils/normalize';
import { XEventsTypes } from '../../wiring/events.types';
import { SearchAdapterDummy } from '../../__tests__/adapter.dummy';
import BaseSuggestion from '../base-suggestion.vue';

describe('testing Base Suggestion component', () => {
  const localVue = createLocalVue();
  localVue.use(XPlugin, { adapter: SearchAdapterDummy });

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

  it('highlights the suggestion query parts matching the query passed as prop', () => {
    expect(component.find('.x-suggestion__query--highlighted').element.textContent).toEqual(query);
  });

  it('does not highlight anything if the query prop is empty', () => {
    component.setProps({ query: '' });
    const isQueryHighlightable = (component.vm as any).isQueryHighlightable;

    expect(isQueryHighlightable).toBe(false);
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
