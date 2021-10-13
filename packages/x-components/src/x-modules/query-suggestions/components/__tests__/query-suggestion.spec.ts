import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { createQuerySuggestion } from '../../../../__stubs__/query-suggestions-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import QuerySuggestion from '../query-suggestion.vue';
import { resetXQuerySuggestionsStateWith } from './utils';

describe('testing query-suggestion component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  const suggestion = createQuerySuggestion('baileys');

  const component = mount(QuerySuggestion, {
    localVue,
    propsData: { suggestion },
    store
  });

  beforeEach(() => {
    resetXQuerySuggestionsStateWith(store);
  });

  it('is an XComponent', () => {
    expect(isXComponent(component.vm)).toEqual(true);
  });

  it('has QuerySuggestionModule as XModule', () => {
    expect(getXComponentXModuleName(component.vm)).toEqual('querySuggestions');
  });

  // TODO: Refactor state to normalized query getter
  it('highlights the suggestion matching parts with the state query', async () => {
    resetXQuerySuggestionsStateWith(store, { query: 'Bá' });

    await localVue.nextTick();

    expect(component.classes()).toContain('x-suggestion--matching');
  });

  it('renders the suggestion received as prop', () => {
    expect(component.text()).toContain(suggestion.query);
  });

  it('emits UserSelectedAQuerySuggestion event on click', async () => {
    const listener = jest.fn();
    const button = component.find(getDataTestSelector('query-suggestion')).element;
    component.vm.$x.on('UserSelectedAQuerySuggestion', true).subscribe(listener);
    await component.trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: suggestion,
      metadata: {
        moduleName: 'querySuggestions',
        target: button
      }
    });
  });
});
