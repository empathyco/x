import { Suggestion } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
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
  maxItemsToRender,
  template = '<QuerySuggestions v-bind="$attrs" />'
}: RenderQuerySuggestionsOptions = {}): RenderQuerySuggestionsApi {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [querySuggestionsXModule] }, localVue);
  resetXQuerySuggestionsStateWith(store, { suggestions });

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: {
        QuerySuggestions
      }
    },
    {
      localVue,
      store,
      propsData: {
        maxItemsToRender
      }
    }
  );

  return {
    wrapper: wrapper.findComponent(QuerySuggestions),
    suggestions,
    async setMaxItemsToRender(max) {
      return await wrapper.setProps({ maxItemsToRender: max });
    },
    getSuggestionItemWrappers() {
      return wrapper.findAll(getDataTestSelector('suggestion-item'));
    }
  };
}

describe('testing Query Suggestions component', () => {
  it('is an XComponent that belongs to the query suggestions module', () => {
    const { wrapper } = renderQuerySuggestions();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('querySuggestions');
  });

  it('does not render anything when suggestions are empty', () => {
    const { wrapper } = renderQuerySuggestions({ suggestions: [] });
    expect(wrapper.html()).toBe('');
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
        </QuerySuggestions>
      `
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
        </QuerySuggestions>
      `
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(`🔍 ${suggestions[index].query}`);
      expect(itemWrapper.find(getDataTestSelector('query-suggestion')).exists()).toBe(true);
    });
  });

  // eslint-disable-next-line max-len
  it('renders at most the number of QuerySuggestion defined by `maxItemsToRender` prop', async () => {
    const { getSuggestionItemWrappers, setMaxItemsToRender, suggestions } = renderQuerySuggestions({
      suggestions: [
        createQuerySuggestion('shirt'),
        createQuerySuggestion('jeans'),
        createQuerySuggestion('tshirt'),
        createQuerySuggestion('jumper')
      ]
    });

    await setMaxItemsToRender(suggestions.length - 1);
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(suggestions.length - 1);

    await setMaxItemsToRender(suggestions.length);
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(suggestions.length);

    await setMaxItemsToRender(suggestions.length + 1);
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(suggestions.length);
  });
});

interface RenderQuerySuggestionsOptions {
  /** The suggestions list to render. */
  suggestions?: Suggestion[];
  /** The maximum number of items to render. */
  maxItemsToRender?: string;
  /** The template to render. */
  template?: string;
}

interface RenderQuerySuggestionsApi {
  /** QuerySuggestions component testing wrapper. */
  wrapper: Wrapper<Vue>;
  /** Retrieves the list item of each suggestion. */
  getSuggestionItemWrappers: () => WrapperArray<Vue>;
  /** Retrieves the list item of each suggestion. */
  setMaxItemsToRender: (max: number) => Promise<void>;
  /** Rendered suggestions data. */
  suggestions: Suggestion[];
}
