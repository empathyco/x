import { Suggestion } from '@empathy/search-types';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { SearchAdapterDummy } from '../../../../plugins/__tests__/adapter.dummy';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import PopularSearch from '../popular-search.vue';
import PopularSearches from '../popular-searches.vue';

describe('testing popular searches component', () => {
  const suggestions: Suggestion[] = [
    {
      facets: [],
      query: 'salt',
      key: 'salt',
      modelName: 'PopularSearch'
    },
    {
      facets: [],
      query: 'limes',
      key: 'limes',
      modelName: 'PopularSearch'
    },
    {
      facets: [],
      query: 'beef short ribs',
      key: 'beef short ribs',
      modelName: 'PopularSearch'
    }
  ];

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store: Store<RootXStoreState> = new Store({});
  localVue.use(XPlugin, { store, adapter: SearchAdapterDummy });

  let popularSearchesWrapper: Wrapper<Vue>;

  beforeEach(() => {
    popularSearchesWrapper = mount(PopularSearches, { localVue, store });
    store.commit('x/popularSearches/setSuggestions', suggestions);
  });

  it('is an XComponent', () => {
    expect(isXComponent(popularSearchesWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(popularSearchesWrapper.vm)).toBe('popularSearches');
  });

  it('renders a button with the query of the popular search (suggestion)', () => {
    const eventButtonsList = findTestDataById(popularSearchesWrapper, 'event-button');

    suggestions.forEach((suggestion, index) => {
      expect(eventButtonsList.at(index).element.innerHTML).toEqual(suggestion.query);
    });
  });

  it('renders a span & and image overriding the default Popular Search content', () => {
    const wrapperComponent = {
      template: `
        <PopularSearches>
          <template #popular-search-content="{suggestion}">
            <img src="./popular-search-icon.svg" class="x-popular-search__icon" data-test="icon"/>
            <span class="x-popular-search__query" data-test="query">{{ suggestion.query }}</span>
          </template>
        </PopularSearches>
      `,
      components: {
        PopularSearches
      }
    };

    popularSearchesWrapper = mount(wrapperComponent, {
      localVue,
      store
    });

    const eventButtonsList = findTestDataById(popularSearchesWrapper, 'query');
    const iconsList = findTestDataById(popularSearchesWrapper, 'icon');

    suggestions.forEach((suggestion, index) => {
      expect(eventButtonsList.at(index).element.innerHTML).toEqual(suggestion.query);
      expect(iconsList.at(index)).toBeDefined();
    });
  });

  it('renders a button & a custom Popular Search', () => {
    const wrapperComponent = {
      template: `
        <PopularSearches>
          <template #popular-search="{suggestion}">
            <PopularSearch :suggestion="suggestion">
              <template #default="{suggestion}">
                <img src="./popular-search-icon.svg"
                     class="x-popular-search__icon"
                     data-test="icon"/>
                <span class="x-popular-search__query"
                      data-test="query">{{ suggestion.query }}</span>
              </template>
            </PopularSearch>
            <button data-test="custom-button">Custom Behaviour</button>
          </template>
        </PopularSearches>
      `,
      components: {
        PopularSearches,
        PopularSearch
      }
    };

    popularSearchesWrapper = mount(wrapperComponent, {
      localVue,
      store
    });

    expect(popularSearchesWrapper.find(PopularSearch)).toBeDefined();

    const eventButtonsList = findTestDataById(popularSearchesWrapper, 'query');
    const iconsList = findTestDataById(popularSearchesWrapper, 'icon');
    const customButtonList = findTestDataById(popularSearchesWrapper, 'custom-button');

    suggestions.forEach((suggestion, index) => {
      expect(eventButtonsList.at(index).element.innerHTML).toEqual(suggestion.query);
      expect(iconsList.at(index)).toBeDefined();
      expect(customButtonList.at(index)).toBeDefined();
    });
  });

  it('does not render any PopularSearch if the are none', async () => {
    store.commit('x/popularSearches/setSuggestions', []);

    await localVue.nextTick();

    expect(popularSearchesWrapper.html()).toEqual('');
  });

  function findTestDataById(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
    return wrapper.findAll(`[data-test=${testDataId}]`);
  }
});
