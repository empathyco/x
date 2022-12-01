import { Suggestion } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createPopularSearch } from '../../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { popularSearchesXModule } from '../../../popular-searches/x-module';
import PopularSearches from '../popular-searches.vue';
import { resetXPopularSearchesStateWith } from './utils';

function renderPopularSearches({
  popularSearches = [
    createPopularSearch('chocolate'),
    createPopularSearch('milk chocolate'),
    createPopularSearch('chocolate milk')
  ],
  maxItemsToRender,
  template = '<PopularSearches v-bind="$attrs" />'
}: RenderPopularSearchesOptions = {}): RenderPopularSearchesApi {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [popularSearchesXModule] }, localVue);
  resetXPopularSearchesStateWith(store, { popularSearches });

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: {
        PopularSearches
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
    wrapper: wrapper.findComponent(PopularSearches),
    popularSearches,
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
    const { wrapper } = renderPopularSearches();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('popularSearches');
  });

  it('does not render anything when suggestions are empty', () => {
    const { wrapper } = renderPopularSearches({ popularSearches: [] });
    expect(wrapper.html()).toBe('');
  });

  it('renders the state list of suggestions', () => {
    const { getSuggestionItemWrappers, popularSearches } = renderPopularSearches({
      popularSearches: [createPopularSearch('chocolate'), createPopularSearch('milk chocolate')]
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(popularSearches[index].query);
    });
  });

  it('allows to render a custom query suggestion', () => {
    const { getSuggestionItemWrappers, popularSearches } = renderPopularSearches({
      popularSearches: [createPopularSearch('chocolate'), createPopularSearch('milk chocolate')],
      template: `
        <PopularSearches #suggestion="{ suggestion }">
          <button class="custom-suggestion">
            <span>🔍</span>
            <span>{{ suggestion.query }}</span>
          </button>
        </PopularSearches>
      `
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.get('.custom-suggestion').text()).toEqual(
        `🔍 ${popularSearches[index].query}`
      );
      expect(itemWrapper.find(getDataTestSelector('popular-search')).exists()).toBe(false);
    });
  });

  it('allows to render a custom suggestion content', () => {
    const { getSuggestionItemWrappers, popularSearches } = renderPopularSearches({
      popularSearches: [createPopularSearch('chocolate'), createPopularSearch('milk chocolate')],
      template: `
        <PopularSearches #suggestion-content="{ suggestion }">
          <span>🔍</span>
          <span>{{ suggestion.query }}</span>
        </PopularSearches>
      `
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(`🔍 ${popularSearches[index].query}`);
      expect(itemWrapper.find(getDataTestSelector('popular-search')).exists()).toBe(true);
    });
  });

  // eslint-disable-next-line max-len
  it('renders at most the number of PopularSearch defined by `maxItemsToRender` prop', async () => {
    const { getSuggestionItemWrappers, setMaxItemsToRender, popularSearches } =
      renderPopularSearches({
        popularSearches: [
          createPopularSearch('shirt'),
          createPopularSearch('jeans'),
          createPopularSearch('tshirt'),
          createPopularSearch('jumper')
        ]
      });

    await setMaxItemsToRender(popularSearches.length - 1);
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(popularSearches.length - 1);

    await setMaxItemsToRender(popularSearches.length);
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(popularSearches.length);

    await setMaxItemsToRender(popularSearches.length + 1);
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(popularSearches.length);
  });
});

interface RenderPopularSearchesOptions {
  /** The suggestions list to render. */
  popularSearches?: Suggestion[];
  /** The maximum number of items to render. */
  maxItemsToRender?: string;
  /** The template to render. */
  template?: string;
}

interface RenderPopularSearchesApi {
  /** PopularSearches component testing wrapper. */
  wrapper: Wrapper<Vue>;
  /** Retrieves the list item of each suggestion. */
  getSuggestionItemWrappers: () => WrapperArray<Vue>;
  /** Retrieves the list item of each suggestion. */
  setMaxItemsToRender: (max: number) => Promise<void>;
  /** Rendered suggestions data. */
  popularSearches: Suggestion[];
}
