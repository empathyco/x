import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { Suggestion } from '@empathyco/x-types';
import Vue, { VueConstructor, ComponentOptions } from 'vue';
import { getQuerySuggestionsStub } from '../../../../__stubs__/query-suggestions-stubs.factory';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import QuerySuggestions from '../query-suggestions.vue';
import { resetXQuerySuggestionsStateWith } from './utils';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Store<DeepPartial<RootXStoreState>>({});
installNewXPlugin({ store }, localVue);

interface QuerySuggestionsOptions {
  suggestions?: Suggestion[];
  component?: VueConstructor | ComponentOptions<Vue>;
}

interface QuerySuggestionsAPI {
  wrapper: Wrapper<Vue>;
  suggestions: Suggestion[];
}

function renderQuerySuggestions({
  suggestions = getQuerySuggestionsStub('gin'),
  component = QuerySuggestions
}: QuerySuggestionsOptions = {}): QuerySuggestionsAPI {
  resetXQuerySuggestionsStateWith(store, { suggestions });

  const wrapper = mount(<VueConstructor>component, { localVue, store });

  return {
    wrapper,
    suggestions
  };
}

describe('testing Query Suggestions component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderQuerySuggestions();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has QuerySuggestionModule as XModule', () => {
    const { wrapper } = renderQuerySuggestions();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('querySuggestions');
  });

  it('does not render anything when suggestions are empty', () => {
    const { wrapper } = renderQuerySuggestions({ suggestions: [] });
    expect(wrapper.findAll('li')).toHaveLength(0);
  });

  it('renders a list of suggestions passed as props', () => {
    const { wrapper, suggestions } = renderQuerySuggestions();
    expect(wrapper.findAll('li')).toHaveLength(suggestions.length);
  });

  it('renders a custom query suggestion when overriding the suggestion slot', () => {
    const suggestionSlotOverridden: ComponentOptions<Vue> = {
      template: `
        <QuerySuggestions>
          <template #suggestion="suggestionContentScope">
            <img
              class="x-query-suggestion__icon"
              data-test="icon"
              src="./query-suggestion-icon.svg"
            />
            <span class="x-query-suggestion__query" :data-index="suggestionContentScope.index"
                  data-test="query">
              {{ suggestionContentScope.suggestion.query }}
            </span>
          </template>
        </QuerySuggestions>
      `,
      components: {
        QuerySuggestions
      }
    };

    const { wrapper, suggestions } = renderQuerySuggestions({
      component: suggestionSlotOverridden
    });

    const suggestionsItemWrappers = wrapper.findAll(
      getDataTestSelector('suggestion-item')
    ).wrappers;
    expect(suggestionsItemWrappers).toHaveLength(suggestions.length);

    suggestionsItemWrappers.forEach((slot, index) => {
      expect(slot.find(getDataTestSelector('icon')).element).toBeDefined();
      expect(slot.find(getDataTestSelector('query')).text()).toEqual(suggestions[index].query);
    });
  });

  it('renders custom content when overriding the suggestion-content slot', () => {
    const suggestionContentSlotOverridden: ComponentOptions<Vue> = {
      template: `
        <QuerySuggestions>
          <template #suggestion-content="{ suggestion, queryHTML }">
            <img
              class="x-query-suggestion__icon"
              data-test="icon"
              src="/query-suggestion-icon.svg"
            />
            <span
              :aria-label="'Select ' + suggestion.query"
              class="x-query-suggestion__query"
              data-test="query"
              v-html="queryHTML"
            />
          </template>
        </QuerySuggestions>
      `,
      components: {
        QuerySuggestions
      }
    };

    const { wrapper, suggestions } = renderQuerySuggestions({
      component: suggestionContentSlotOverridden
    });

    const suggestionsItemWrappers = findTestDataById(wrapper, 'query-suggestion').wrappers;
    expect(suggestionsItemWrappers).toHaveLength(suggestions.length);

    suggestionsItemWrappers.forEach((slot, index) => {
      expect(slot.find(getDataTestSelector('icon')).element).toBeDefined();
      expect(slot.find(getDataTestSelector('query')).text()).toEqual(suggestions[index].query);
    });
  });

  // eslint-disable-next-line max-len
  it('renders at most the number of QuerySuggestion defined by `maxItemsToRender` prop', async () => {
    const { wrapper, suggestions } = renderQuerySuggestions();

    const renderedQuerySuggestions = (): WrapperArray<Vue> =>
      findTestDataById(wrapper, 'query-suggestion');

    await wrapper.setProps({ maxItemsToRender: suggestions.length - 1 });
    expect(renderedQuerySuggestions()).toHaveLength(suggestions.length - 1);

    await wrapper.setProps({ maxItemsToRender: suggestions.length });
    expect(renderedQuerySuggestions()).toHaveLength(suggestions.length);

    await wrapper.setProps({ maxItemsToRender: suggestions.length + 1 });
    expect(renderedQuerySuggestions()).toHaveLength(suggestions.length);
  });

  function findTestDataById(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
    return wrapper.findAll(getDataTestSelector(testDataId));
  }
});
