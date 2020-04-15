import { Facet, Suggestion } from '@empathy/search-types';
import { deepMerge } from '@empathybroker/deep-merge';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchAdapterDummy } from '../../../../plugins/__tests__/adapter.dummy';
import { DeepPartial } from '../../../../utils/types';
import { getDataTestSelector } from '../../../../__tests__/utils';
import { querySuggestionsXStoreModule } from '../../store/module';
import { QuerySuggestionsState } from '../../store/types';
import { querySuggestionsXModule } from '../../x-module';
import QuerySuggestions from '../query-suggestions.vue';

describe('testing Suggestions component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store({});
  localVue.use(XPlugin, { adapter: SearchAdapterDummy, store });

  XPlugin.registerXModule(querySuggestionsXModule);

  const suggestions: Suggestion[] = [
    {
      facets: [],
      query: 'salt',
      key: 'salt',
      modelName: 'QuerySuggestion'
    },
    {
      facets: [],
      query: 'limes',
      key: 'limes',
      modelName: 'QuerySuggestion'
    },
    {
      facets: [createFacetWithFilter('fruit')],
      query: 'limes',
      key: 'limes',
      modelName: 'QuerySuggestion'
    },
    {
      facets: [createFacetWithFilter('fresh')],
      query: 'limes',
      key: 'limes',
      modelName: 'QuerySuggestion'
    },
    {
      facets: [],
      query: 'beef short ribs',
      key: 'beef short ribs',
      modelName: 'QuerySuggestion'
    }
  ];

  const component = mount(QuerySuggestions, {
    localVue,
    store
  });

  /**
   * Creates a facet with a filter.
   *
   * @param category - The facet category.
   * @returns The facet.
   */
  function createFacetWithFilter(category: string): Facet {
    const facet: Facet = {
      modelName: 'Facet',
      filters: [],
      title: 'category'
    };

    facet.filters.push({
      modelName: 'Filter',
      id: `category:${category}`,
      callbackInfo: {},
      children: [],
      count: 10,
      parent: null,
      selected: false,
      title: category,
      value: {
        filter: `category:${category}`
      },
      facet
    });

    return facet;
  }

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

  it('does not render anything when suggestions are empty', () => {
    expect(component.findAll('li')).toHaveLength(0);
  });

  it('renders a list of suggestions passed as props', async () => {
    resetStateWith({ suggestions });

    await localVue.nextTick();

    expect(component.findAll('li')).toHaveLength(suggestions.length);
  });

  it('renders a custom query suggestion when overriding the suggestion slot', () => {
    resetStateWith({ suggestions });

    const suggestionSlotOverridden = {
      template: `
        <QuerySuggestions>
          <template #suggestion="{ suggestion }">
            <img
              class="x-query-suggestion__icon"
              data-test="icon"
              src="./query-suggestion-icon.svg"
            />
            <span class="x-query-suggestion__query" data-test="query">
              {{ suggestion.query }}
            </span>
          </template>
        </QuerySuggestions>
      `,
      components: {
        QuerySuggestions
      }
    };

    const querySuggestions = mount(suggestionSlotOverridden, {
      localVue,
      store
    });

    const suggestionsItemWrappers = querySuggestions.findAll(getDataTestSelector('suggestion-item'))
      .wrappers;
    expect(suggestionsItemWrappers).toHaveLength(suggestions.length);

    suggestionsItemWrappers.forEach((slot, index) => {
      expect(slot.find(getDataTestSelector('icon')).element).toBeDefined();
      expect(slot.find(getDataTestSelector('query')).text()).toEqual(suggestions[index].query);
    });
  });

  it('renders custom content when overriding the suggestion-content slot', () => {
    resetStateWith({ suggestions });

    const suggestionContentSlotOverridden = {
      template: `
        <QuerySuggestions>
          <template #suggestion-content="{ suggestion, suggestionQueryHighlighted }">
            <img
              class="x-query-suggestion__icon"
              data-test="icon"
              src="/query-suggestion-icon.svg"
            />
            <span
              :aria-label="'Select ' + suggestion.query"
              class="x-query-suggestion__query"
              data-test="query"
              v-html="suggestionQueryHighlighted"
            />
          </template>
        </QuerySuggestions>
      `,
      components: {
        QuerySuggestions
      }
    };

    const querySuggestions = mount(suggestionContentSlotOverridden, {
      localVue,
      store
    });

    const suggestionsItemWrappers = querySuggestions.findAll(getDataTestSelector('suggestion-item'))
      .wrappers;
    expect(suggestionsItemWrappers).toHaveLength(suggestions.length);

    suggestionsItemWrappers.forEach((slot, index) => {
      expect(slot.find(getDataTestSelector('icon')).element).toBeDefined();
      expect(slot.find(getDataTestSelector('query')).text()).toEqual(suggestions[index].query);
    });
  });
});
