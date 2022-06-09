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
import {
  createSuggestionFacets,
  createSuggestionWithFacets
} from '../../../../__stubs__/base-suggestion-stubs.factory';
import { getFlattenFilters } from '../../../query-suggestions/components/__tests__/utils';
import { resetXPopularSearchesStateWith } from './utils';

const popularSearches = getPopularSearchesStub();

const localVue = createLocalVue();
localVue.use(Vuex);

const store: Store<DeepPartial<RootXStoreState>> = new Store({});

installNewXPlugin({ store }, localVue);

function renderPopularSearches({
  customSlotName = 'suggestion',
  customSlot = '',
  template = `<PopularSearches
                :maxItemsToRender="maxItemsToRender"
                :showFacets="showFacets"
                :appendSuggestionWithoutFilter="appendSuggestionWithoutFilter">
                <template #${customSlotName}="{suggestion, index, filter}">
                  ${customSlot}
                </template>
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

  const findTestDataById = (id: string): WrapperArray<Vue> =>
    wrapper.findAll(getDataTestSelector(id));

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
    const customSlot = `
        <img src="./popular-search-icon.svg" class="x-popular-search__icon" data-test="icon"/>
        <span class="x-popular-search__query" :data-index="index"
          data-test="query">{{ suggestion.query }}</span>`;
    const { findTestDataById } = renderPopularSearches({
      customSlot,
      customSlotName: 'suggestion-content'
    });
    const eventSpansList = findTestDataById('query');
    const iconsList = findTestDataById('icon');
    popularSearches.forEach((suggestion, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(suggestion.query);
      expect(iconsList.at(index)).toBeDefined();
    });
  });

  it('renders a button & a custom Popular Search', () => {
    const customSlot = `<PopularSearch :suggestion="suggestion">
          <template #default="{suggestion}">
            <img src="./popular-search-icon.svg"
                 class="x-popular-search__icon"
                 data-test="icon"/>
            <span class="x-popular-search__query"
                  data-test="query">{{ suggestion.query }}</span>
          </template>
        </PopularSearch>
        <button data-test="custom-button">Custom Behaviour</button>`;
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
      customSlot: `<span data-test="popular-search">
          {{ suggestion.query }} - {{ filter.label }}
        </span>`,
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
      customSlot: `<span data-test="popular-search">
         {{ suggestion.query }}{{ filter ? filter.label : '' }}
        </span>`,
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

  // eslint-disable-next-line max-len
  it('renders at most the number of suggestions defined by `maxItemsToRender` prop counting with the facets', async () => {
    const suggestionsWithoutFacets = getPopularSearchesStub();
    const suggestionWithFacets = createSuggestionWithFacets(
      'testQuery',
      'testQuery',
      'PopularSearch'
    );
    const { wrapper, getPopularSearchItems, suggestions } = renderPopularSearches({
      customSlot: `<span data-test="popular-search">{{suggestion.query}}</span>`,
      showFacets: true,
      suggestions: [...suggestionWithFacets, ...getPopularSearchesStub()]
    });

    const filterCount = suggestionWithFacets[0].facets.reduce((acc, act) => {
      return acc + act.filters.length;
    }, 0);

    await wrapper.setProps({ maxItemsToRender: filterCount + 1 });

    expect(getPopularSearchItems()).toHaveLength(suggestions.length);
    expect(getPopularSearchItems().at(-1).text()).toContain(suggestionsWithoutFacets[0].query);
  });
});

/**
 * The options for the `renderPopularSearches` function.
 */
interface PopularSearchesOptions {
  /** The name of the custom slot to be used. */
  customSlotName?: 'suggestion' | 'suggestion-content';
  /** The content to be rendered in the custom slot. */
  customSlot?: string;
  /** The template of the wrapper component. */
  template?: string;
  /** The suggestions to render. */
  suggestions?: Suggestion[];
  maxItemsToRender?: number;
  /** Indicates if the suggestion's facets should be rendered. */
  showFacets?: boolean;
  /** Indicates if the default suggestion must be rendered along the suggestions with facets. */
  appendSuggestionWithoutFilter?: boolean;
}

/**
 * Test API for the {@link  PopularSearches} component.
 */
interface PopularSearchesAPI {
  /** The wrapper for PopularSearches component. */
  wrapper: Wrapper<Vue>;
  /** The rendered suggestions. */
  suggestions: Suggestion[];
  /** Returns the rendered popular searches items. */
  getPopularSearchItems: () => WrapperArray<Vue>;
  /**
   * Gets the wrapper components corresponding to the given test id.
   *
   * @param id - The data test ID to search.
   */
  findTestDataById: (id: string) => WrapperArray<Vue>;
  /** The local Vue instance where the component is mounted. */
  localVue: typeof Vue;
}
