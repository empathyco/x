import { Suggestion } from '@empathy/search-types';
import { deepMerge } from '@empathybroker/deep-merge';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchAdapterDummy } from '../../../../plugins/__tests__/adapter.dummy';
import { DeepPartial } from '../../../../utils/types';
import { querySuggestionsXStoreModule } from '../../store/module';
import { QuerySuggestionsState } from '../../store/types';
import { querySuggestionsXModule } from '../../x-module';
import QuerySuggestion from '../query-suggestion.vue';

describe('testing query-suggestion component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store({});
  localVue.use(XPlugin, { adapter: SearchAdapterDummy, store });

  XPlugin.registerXModule(querySuggestionsXModule);

  const suggestion: Suggestion = {
    query: 'espanita',
    facets: [],
    key: 'espanita',
    modelName: 'QuerySuggestion'
  };

  const component = mount(QuerySuggestion, {
    localVue,
    propsData: {
      suggestion
    },
    store
  });

  /**
   * Replaces the old querySuggestions state with the new one.
   *
   * @param state - The querySuggestionsState.
   */
  function resetStateWith(state: DeepPartial<QuerySuggestionsState>): void {
    const newQuerySuggestionsState = deepMerge(querySuggestionsXStoreModule.state(), state);
    store.replaceState({
      x: {
        querySuggestions: newQuerySuggestionsState
      }
    });
  }

  beforeEach(() => {
    resetStateWith({});
  });

  it('is an XComponent', () => {
    expect(isXComponent(component.vm)).toEqual(true);
  });

  it('has QuerySuggestionModule as XModule', () => {
    expect(getXComponentXModuleName(component.vm)).toEqual('querySuggestions');
  });

  // TODO: Refactor state to normalized query getter
  it('highlights the suggestion matching parts with the state query', async () => {
    resetStateWith({ query: 'esp' });

    await localVue.nextTick();

    expect(component.classes()).toContain('x-suggestion--query-highlighted');
  });

  it('renders the suggestion received as prop', () => {
    expect(component.text()).toContain(suggestion.query);
  });

  it('emits UserSelectedAQuerySuggestion event on click', () => {
    const listener = jest.fn();
    const button = component.find('[data-test="query-suggestion"]').element;
    component.vm.$x.on('UserSelectedAQuerySuggestion', true).subscribe(listener);
    component.trigger('click');

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
