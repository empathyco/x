import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { Suggestion } from '@empathyco/x-types';
import Vue from 'vue';
import {
  createQuerySuggestion,
  getQuerySuggestionsStub
} from '../../../../__stubs__/query-suggestions-stubs.factory';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import QuerySuggestions from '../query-suggestions.vue';
import QuerySuggestion from '../query-suggestion.vue';
import { createSuggestionFacets } from '../../../../__stubs__/base-suggestion-stubs.factory';
import { getFlattenFilters, resetXQuerySuggestionsStateWith } from './utils';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Store<DeepPartial<RootXStoreState>>({});
installNewXPlugin({ store }, localVue);

function findTestDataById(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
  return wrapper.findAll(getDataTestSelector(testDataId));
}

function renderQuerySuggestions({
  customSlotName = 'suggestion',
  customSlot = '',
  template = `<QuerySuggestions
                :showFacets="showFacets"
                :appendSuggestionWithoutFilter="appendSuggestionWithoutFilter">
                  <template #${customSlotName}="{suggestion, index, filter, queryHTML}">
                    ${customSlot}
                  </template>
              </QuerySuggestions>`,
  suggestions = getQuerySuggestionsStub('gin'),
  showFacets = false,
  appendSuggestionWithoutFilter = false
}: QuerySuggestionsOptions = {}): QuerySuggestionsAPI {
  resetXQuerySuggestionsStateWith(store, { suggestions });

  const wrapper = mount(
    {
      template,
      components: { QuerySuggestions, QuerySuggestion },
      props: ['showFacets', 'appendSuggestionWithoutFilter']
    },
    {
      localVue,
      store,
      propsData: { showFacets, appendSuggestionWithoutFilter }
    }
  );

  return {
    wrapper: wrapper.findComponent(QuerySuggestions),
    suggestions,
    getSuggestionItems: (suggestionDataTestId = 'query-suggestion') => {
      return findTestDataById(wrapper, suggestionDataTestId);
    }
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
    const { wrapper, suggestions } = renderQuerySuggestions({
      customSlot: `<img
                    class="x-query-suggestion__icon"
                    data-test="icon"
                    src="./query-suggestion-icon.svg"
                  />
                  <span class="x-query-suggestion__query" :data-index="index"
                        data-test="query">
                    {{ suggestion.query }}
                  </span>`,
      customSlotName: 'suggestion'
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
    const { suggestions, getSuggestionItems } = renderQuerySuggestions({
      customSlot: `<img
                      class="x-query-suggestion__icon"
                      data-test="icon"
                      src="/query-suggestion-icon.svg"
                    />
                    <span
                      :aria-label="'Select ' + suggestion.query"
                      class="x-query-suggestion__query"
                      data-test="query"
                      v-html="queryHTML"
                    />`,
      customSlotName: 'suggestion-content'
    });

    const suggestionsItemWrappers = getSuggestionItems().wrappers;
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

  it('renders all suggestions with facets if showFacets is true', () => {
    const suggestions: Suggestion[] = [
      createQuerySuggestion('gin', {
        facets: createSuggestionFacets()
      })
    ];

    const { getSuggestionItems } = renderQuerySuggestions({
      customSlot: `<span>{{ suggestion.query }} - {{ filter ? filter.label : '' }}</span>`,
      showFacets: true,
      suggestions
    });
    const suggestionItems = getSuggestionItems('suggestion-item');

    expect(suggestionItems.wrappers).toHaveLength(3);

    const filters = getFlattenFilters(suggestions[0]);

    suggestionItems.wrappers.forEach((suggestionItemWrapper, index) =>
      expect(suggestionItemWrapper.text()).toBe(`${suggestions[0].query} - ${filters[index]}`)
    );
  });

  it('shows the suggestions with facets and the query itself', () => {
    const suggestions: Suggestion[] = [
      createQuerySuggestion('gin', {
        facets: createSuggestionFacets()
      })
    ];

    const { getSuggestionItems } = renderQuerySuggestions({
      customSlot: `<span data-test="query-suggestion">
         {{ suggestion.query }}{{ filter ? filter.label : '' }}
        </span>`,
      showFacets: true,
      appendSuggestionWithoutFilter: true,
      suggestions: suggestions
    });
    expect(getSuggestionItems()).toHaveLength(4);

    expect(getSuggestionItems().wrappers[0].text()).toBe(suggestions[0].query);

    const filters = getFlattenFilters(suggestions[0]);
    getSuggestionItems().wrappers.forEach((suggestionItemWrapper, index) => {
      expect(suggestionItemWrapper.text()).toBe(
        index === 0 ? suggestions[0].query : `${suggestions[0].query}${filters[index - 1]}`
      );
    });
  });
});

/**
 * The options to render the {@link QuerySuggestions} component.
 */
interface QuerySuggestionsOptions {
  /** The suggestions to render. */
  suggestions?: Suggestion[];
  /** The name of the custom slot to be used. */
  customSlotName?: 'suggestion' | 'suggestion-content';
  /** The content to be rendered in the custom slot. */
  customSlot?: string;
  /** The template of the wrapper component. */
  template?: string;
  /** Indicates if the suggestion's facets should be rendered. */
  showFacets?: boolean;
  /** Indicates if the default suggestion must be rendered along the suggestions with facets. */
  appendSuggestionWithoutFilter?: boolean;
}

interface QuerySuggestionsAPI {
  /** The wrapper for QuerySuggestions component. */
  wrapper: Wrapper<Vue>;
  /** The rendered suggestions. */
  suggestions: Suggestion[];
  /**
   * Returns the rendered suggestions wrappers.
   *
   * @param suggestionDataTestId - The dataTest used to retrieve the suggestions.
   */
  getSuggestionItems: (suggestionDataTestId?: string) => WrapperArray<Vue>;
}
