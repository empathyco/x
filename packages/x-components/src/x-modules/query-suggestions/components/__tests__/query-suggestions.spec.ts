import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { Store } from 'vuex';
import { nextTick } from 'vue';
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
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: { QuerySuggestions }
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [querySuggestionsXModule] })]
      },
      store,
      props: { maxItemsToRender }
    }
  );

  resetXQuerySuggestionsStateWith(store, { suggestions });

  return {
    wrapper,
    suggestions,
    getSuggestionItemWrappers: () => wrapper.findAll(getDataTestSelector('suggestion-item'))
  };
}

describe('testing Query Suggestions component', () => {
  it('is an XComponent that belongs to the query suggestions module', () => {
    const { wrapper } = renderQuerySuggestions();

    expect(isXComponent(wrapper.findComponent(QuerySuggestions).vm)).toBeTruthy();
    expect(getXComponentXModuleName(wrapper.findComponent(QuerySuggestions).vm)).toEqual(
      'querySuggestions'
    );
  });

  it('does not render anything when suggestions are empty', () => {
    const { wrapper } = renderQuerySuggestions({ suggestions: [] });

    expect(wrapper.find('x-query-suggestions').exists()).toBe(false);
  });

  it('renders the state list of suggestions', async () => {
    const { getSuggestionItemWrappers, suggestions } = renderQuerySuggestions({
      suggestions: [createQuerySuggestion('chocolate'), createQuerySuggestion('milk chocolate')]
    });
    await nextTick();
    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(suggestions[index].query);
    });
  });

  it('allows to render a custom query suggestion', async () => {
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
    await nextTick();
    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.get('.custom-suggestion').text()).toEqual(`🔍${suggestions[index].query}`);
      expect(itemWrapper.find(getDataTestSelector('query-suggestion')).exists()).toBe(false);
    });
  });

  it('allows to render a custom suggestion content', async () => {
    const { getSuggestionItemWrappers, suggestions } = renderQuerySuggestions({
      suggestions: [createQuerySuggestion('chocolate'), createQuerySuggestion('milk chocolate')],
      template: `
        <QuerySuggestions #suggestion-content="{ suggestion }">
          <span>🔍</span>
          <span>{{ suggestion.query }}</span>
        </QuerySuggestions>`
    });
    await nextTick();
    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(`🔍${suggestions[index].query}`);
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await wrapper.setProps({ maxItemsToRender: suggestions.length - 1 });
    expect(getSuggestionItemWrappers()).toHaveLength(suggestions.length - 1);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await wrapper.setProps({ maxItemsToRender: suggestions.length });
    expect(getSuggestionItemWrappers()).toHaveLength(suggestions.length);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await wrapper.setProps({ maxItemsToRender: suggestions.length });
    expect(getSuggestionItemWrappers()).toHaveLength(suggestions.length);
  });
});
