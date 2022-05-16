import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { Suggestion } from '@empathyco/x-types';
import { getPopularSearchesStub } from '../../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import PopularSearches from '../popular-searches.vue';
import PopularSearch from '../popular-search.vue';
import { createSuggestionFacets } from '../../../../__stubs__/base-suggestion-stubs.factory';
import { getFlattenFilters } from '../../../query-suggestions/components/__tests__/utils';
import { resetXPopularSearchesStateWith } from './utils';

const popularSearches = getPopularSearchesStub();

const localVue = createLocalVue();
localVue.use(Vuex);

const store: Store<DeepPartial<RootXStoreState>> = new Store({});

installNewXPlugin({ store }, localVue);

function renderPopularSearches({
  customSlot = '',
  template = `<PopularSearches
                :maxItemsToRender="maxItemsToRender"
                :showFacets="showFacets"
                :appendSuggestionWithoutFilter="appendSuggestionWithoutFilter">
                ${customSlot}
              </PopularSearches>`,
  suggestions = getPopularSearchesStub(),
  maxItemsToRender = undefined,
  showFacets = false,
  appendSuggestionWithoutFilter = false
}: PopularSearchesOptions = {}): PopularSearchesAPI {
  resetXPopularSearchesStateWith(store, { popularSearches: suggestions });

  const wrapper = mount(
    {
      template,
      components: {
        PopularSearches,
        PopularSearch
      },
      props: ['maxItemsToRender', 'showFacets', 'appendSuggestionWithoutFilter']
    },
    {
      localVue,
      store,
      propsData: {
        suggestions,
        maxItemsToRender,
        showFacets,
        appendSuggestionWithoutFilter
      }
    }
  );

  const findTestDataById = (selector: string): WrapperArray<Vue> =>
    wrapper.findAll(getDataTestSelector(selector));

  return {
    wrapper: wrapper.findComponent(PopularSearches),
    suggestions,
    localVue,
    findTestDataById,
    getPopularSearchItems: findTestDataById.bind(null, 'popular-search')
  };
}

describe('testing popular searches component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderPopularSearches();
    expect(isXComponent(wrapper.vm)).toBe(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('popularSearches');
  });

  it('renders a button with the query of the popular search (suggestion)', () => {
    const { getPopularSearchItems } = renderPopularSearches();
    const eventButtonsList = getPopularSearchItems();

    popularSearches.forEach((suggestion, index) => {
      expect(eventButtonsList.at(index).element.innerHTML).toContain(suggestion.query);
    });
  });

  it('renders a span & and image overriding the default Popular Search content', () => {
    const customSlot = `<template #suggestion-content="suggestionContentScope">
            <img src="./popular-search-icon.svg" class="x-popular-search__icon" data-test="icon"/>
            <span class="x-popular-search__query" :data-index="suggestionContentScope.index"
                data-test="query">{{ suggestionContentScope.suggestion.query }}</span>
        </template>`;
    const { findTestDataById } = renderPopularSearches({ customSlot });
    const eventSpansList = findTestDataById('query');
    const iconsList = findTestDataById('icon');
    popularSearches.forEach((suggestion, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(suggestion.query);
      expect(iconsList.at(index)).toBeDefined();
    });
  });

  it('renders a button & a custom Popular Search', () => {
    const customSlot = `<template #suggestion="{suggestion}">
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
      </template>`;
    const { wrapper, findTestDataById } = renderPopularSearches({ customSlot });
    expect(wrapper.findComponent(PopularSearch)).toBeDefined();

    const eventSpansList = findTestDataById('query');
    const iconsList = findTestDataById('icon');
    const customButtonList = findTestDataById('custom-button');

    popularSearches.forEach((suggestion, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(suggestion.query);
      expect(iconsList.at(index)).toBeDefined();
      expect(customButtonList.at(index)).toBeDefined();
    });
  });

  it('does not render any PopularSearch if the are none', () => {
    const { wrapper } = renderPopularSearches({ suggestions: [] });
    expect(wrapper.html()).toBe('');
  });

  it('renders at most the number of PopularSearch defined by `maxItemsToRender` prop', async () => {
    const { wrapper, findTestDataById } = renderPopularSearches();
    const renderedPopularSearches = (): WrapperArray<Vue> => findTestDataById('popular-search');

    await wrapper.setProps({ maxItemsToRender: 2 });
    expect(renderedPopularSearches()).toHaveLength(2);

    await wrapper.setProps({ maxItemsToRender: 3 });
    expect(renderedPopularSearches()).toHaveLength(3);

    await wrapper.setProps({ maxItemsToRender: 5 });
    expect(renderedPopularSearches()).toHaveLength(popularSearches.length);
  });

  it('renders all suggestions with facets if showFacets is true', () => {
    const popularSearches = getPopularSearchesStub(1);
    popularSearches[0].facets = createSuggestionFacets();

    const { getPopularSearchItems } = renderPopularSearches({
      customSlot: `<template #suggestion="{suggestion, filter}">
          <span data-test="popular-search">{{ suggestion.query }} - {{ filter.label }}</span>
        </template>`,
      showFacets: true,
      suggestions: popularSearches
    });

    expect(getPopularSearchItems()).toHaveLength(3);

    const filters = getFlattenFilters(popularSearches[0]);

    getPopularSearchItems().wrappers.forEach((suggestionItemWrapper, index) =>
      expect(suggestionItemWrapper.text()).toBe(`${popularSearches[0].query} - ${filters[index]}`)
    );
  });

  it('shows the suggestions with facets and the query itself', () => {
    const popularSearches = getPopularSearchesStub(1);
    popularSearches[0].facets = createSuggestionFacets();

    const { getPopularSearchItems } = renderPopularSearches({
      customSlot: `<template #suggestion="{suggestion, filter}">
          <span data-test="popular-search">
            {{ suggestion.query }}{{ filter ? filter.label : '' }}
          </span>
        </template>`,
      showFacets: true,
      appendSuggestionWithoutFilter: true,
      suggestions: popularSearches
    });
    expect(getPopularSearchItems()).toHaveLength(4);
    expect(getPopularSearchItems().wrappers[0].text()).toBe(popularSearches[0].query);

    const filters = getFlattenFilters(popularSearches[0]);
    getPopularSearchItems().wrappers.forEach((suggestionItemWrapper, index) => {
      expect(suggestionItemWrapper.text()).toBe(
        index === 0 ? popularSearches[0].query : `${popularSearches[0].query}${filters[index - 1]}`
      );
    });
  });
});

/**
 * The options for the `renderPopularSearches` function.
 */
interface PopularSearchesOptions {
  customSlot?: string;
  template?: string;
  suggestions?: Suggestion[];
  maxItemsToRender?: number;
  showFacets?: boolean;
  appendSuggestionWithoutFilter?: boolean;
}

/**
 * Test API for the {@link  PopularSearches} component.
 */
interface PopularSearchesAPI {
  wrapper: Wrapper<Vue>;
  suggestions: Suggestion[];
  getPopularSearchItems: () => WrapperArray<Vue>;
  findTestDataById: (selector: string) => WrapperArray<Vue>;
  localVue: typeof Vue;
}
