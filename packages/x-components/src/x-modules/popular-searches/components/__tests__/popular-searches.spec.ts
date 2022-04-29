import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getPopularSearchesStub } from '../../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import PopularSearch from '../popular-search.vue';
import PopularSearches from '../popular-searches.vue';
import { resetXPopularSearchesStateWith } from './utils';

describe('testing popular searches component', () => {
  const popularSearches = getPopularSearchesStub();

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store: Store<DeepPartial<RootXStoreState>> = new Store({});
  installNewXPlugin({ store }, localVue);

  let popularSearchesWrapper: Wrapper<Vue>;

  beforeEach(() => {
    popularSearchesWrapper = mount(PopularSearches, { localVue, store });
    resetXPopularSearchesStateWith(store, { popularSearches });
  });

  it('is an XComponent', () => {
    expect(isXComponent(popularSearchesWrapper.vm)).toBe(true);
    expect(getXComponentXModuleName(popularSearchesWrapper.vm)).toBe('popularSearches');
  });

  it('renders a button with the query of the popular search (suggestion)', () => {
    const eventButtonsList = findTestDataById(popularSearchesWrapper, 'popular-search');

    popularSearches.forEach((suggestion, index) => {
      expect(eventButtonsList.at(index).element.innerHTML).toContain(suggestion.query);
    });
  });

  it('renders a span & and image overriding the default Popular Search content', () => {
    const wrapperComponent = {
      template: `
        <PopularSearches>
          <template #suggestion-content="suggestionContentScope">
            <img src="./popular-search-icon.svg" class="x-popular-search__icon" data-test="icon"/>
            <span class="x-popular-search__query" :data-index="suggestionContentScope.index"
                  data-test="query">{{ suggestionContentScope.suggestion.query }}</span>
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

    const eventSpansList = findTestDataById(popularSearchesWrapper, 'query');
    const iconsList = findTestDataById(popularSearchesWrapper, 'icon');

    popularSearches.forEach((suggestion, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(suggestion.query);
      expect(iconsList.at(index)).toBeDefined();
    });
  });

  it('renders a button & a custom Popular Search', () => {
    const wrapperComponent = {
      template: `
        <PopularSearches>
          <template #suggestion="{suggestion}">
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

    expect(popularSearchesWrapper.findComponent(PopularSearch)).toBeDefined();

    const eventSpansList = findTestDataById(popularSearchesWrapper, 'query');
    const iconsList = findTestDataById(popularSearchesWrapper, 'icon');
    const customButtonList = findTestDataById(popularSearchesWrapper, 'custom-button');

    popularSearches.forEach((suggestion, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(suggestion.query);
      expect(iconsList.at(index)).toBeDefined();
      expect(customButtonList.at(index)).toBeDefined();
    });
  });

  it('does not render any PopularSearch if the are none', async () => {
    resetXPopularSearchesStateWith(store);

    await localVue.nextTick();

    expect(popularSearchesWrapper.html()).toBe('');
  });

  it('renders at most the number of PopularSearch defined by `maxItemsToRender` prop', async () => {
    const renderedPopularSearches = (): WrapperArray<Vue> =>
      findTestDataById(popularSearchesWrapper, 'popular-search');

    await popularSearchesWrapper.setProps({ maxItemsToRender: 2 });
    expect(renderedPopularSearches()).toHaveLength(2);

    await popularSearchesWrapper.setProps({ maxItemsToRender: 3 });
    expect(renderedPopularSearches()).toHaveLength(3);

    await popularSearchesWrapper.setProps({ maxItemsToRender: 5 });
    expect(renderedPopularSearches()).toHaveLength(popularSearches.length);
  });

  function findTestDataById(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
    return wrapper.findAll(getDataTestSelector(testDataId));
  }
});
