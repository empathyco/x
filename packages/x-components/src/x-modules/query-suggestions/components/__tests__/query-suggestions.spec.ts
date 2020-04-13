import { Facet, Suggestion } from '@empathy/search-types';
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

  const component = mount(QuerySuggestions, {
    localVue,
    store
  });

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
});
