import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { createQuerySuggestion } from '../../../../__stubs__/query-suggestions-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { querySuggestionsXModule } from '../../x-module';
import QuerySuggestions from '../query-suggestions.vue';
import { resetXQuerySuggestionsStateWith } from './utils';

function renderQuerySuggestions({
  suggestions = [
    createQuerySuggestion('chocolate'),
    createQuerySuggestion('milk chocolate'),
    createQuerySuggestion('chocolate milk')
  ],
  maxItemsToRender = 5,
  template = '<QuerySuggestions v-bind="$attrs" />'
} = {}) {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});

  installNewXPlugin({ store, initialXModules: [querySuggestionsXModule] }, localVue);
  resetXQuerySuggestionsStateWith(store, { suggestions });

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: { QuerySuggestions }
    },
    {
      localVue,
      store,
      propsData: { maxItemsToRender }
    }
  );

  return {
    wrapper: wrapper.findComponent(QuerySuggestions),
    suggestions,
    getSuggestionItemWrappers: () => wrapper.findAll(getDataTestSelector('suggestion-item'))
  };
}

describe('testing Query Suggestions component', () => {
  it('is an XComponent that belongs to the query suggestions module', () => {
    const { wrapper } = renderQuerySuggestions();

    expect(isXComponent(wrapper.vm)).toBeTruthy();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('querySuggestions');
  });

  it('does not render anything when suggestions are empty', () => {
    const { wrapper } = renderQuerySuggestions({ suggestions: [] });

    expect(wrapper.html()).toEqual('');
  });

  it('renders the state list of suggestions', () => {
    const { getSuggestionItemWrappers, suggestions } = renderQuerySuggestions({
      suggestions: [createQuerySuggestion('chocolate'), createQuerySuggestion('milk chocolate')]
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(suggestions[index].query);
    });
  });

  it('allows to render a custom query suggestion', () => {
    const { getSuggestionItemWrappers, suggestions } = renderQuerySuggestions({
      suggestions: [createQuerySuggestion('chocolate'), createQuerySuggestion('milk chocolate')],
      template: `
        <QuerySuggestions #suggestion="{ suggestion }">
          <button class="custom-suggestion">
            <span>🔍</span>
            <span>{{ suggestion.query }}</span>
          </button>
        </QuerySuggestions>`
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.get('.custom-suggestion').text()).toEqual(
        `🔍 ${suggestions[index].query}`
      );
      expect(itemWrapper.find(getDataTestSelector('query-suggestion')).exists()).toBe(false);
    });
  });

  it('allows to render a custom suggestion content', () => {
    const { getSuggestionItemWrappers, suggestions } = renderQuerySuggestions({
      suggestions: [createQuerySuggestion('chocolate'), createQuerySuggestion('milk chocolate')],
      template: `
        <QuerySuggestions #suggestion-content="{ suggestion }">
          <span>🔍</span>
          <span>{{ suggestion.query }}</span>
        </QuerySuggestions>`
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(`🔍 ${suggestions[index].query}`);
      expect(itemWrapper.find(getDataTestSelector('query-suggestion')).exists()).toBe(true);
    });
  });

  it('renders at most the number of QuerySuggestion defined by `maxItemsToRender` prop', async () => {
    const { wrapper, getSuggestionItemWrappers, suggestions } = renderQuerySuggestions({
      suggestions: [
        createQuerySuggestion('shirt'),
        createQuerySuggestion('jeans'),
        createQuerySuggestion('tshirt'),
        createQuerySuggestion('jumper')
      ]
    });

    await wrapper.setProps({ maxItemsToRender: suggestions.length - 1 });
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(suggestions.length - 1);

    await wrapper.setProps({ maxItemsToRender: suggestions.length });
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(suggestions.length);

    await wrapper.setProps({ maxItemsToRender: suggestions.length });
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(suggestions.length);
  });
});
