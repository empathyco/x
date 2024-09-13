import { Suggestion } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { Store } from 'vuex';
import { nextTick } from 'vue';
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
  const store = new Store<DeepPartial<RootXStoreState>>({});
  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: {
        PopularSearches
      }
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [popularSearchesXModule] })]
      },
      store,
      propsData: {
        maxItemsToRender
      }
    }
  );

  resetXPopularSearchesStateWith(store, { popularSearches });

  return {
    wrapper: wrapper.findComponent(PopularSearches),
    popularSearches,
    async setMaxItemsToRender(max) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return await wrapper.setProps({ maxItemsToRender: max });
    },
    getSuggestionItemWrappers() {
      return wrapper.findAll(getDataTestSelector('suggestion-item'));
    }
  };
}

describe('testing Query Suggestions component', () => {
  it('is an XComponent that belongs to the  popular searches module', () => {
    const { wrapper } = renderPopularSearches();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('popularSearches');
  });

  it('does not render anything when suggestions are empty', () => {
    const { wrapper } = renderPopularSearches({ popularSearches: [] });
    expect(wrapper.find('x-popular-searches').exists()).toBe(false);
  });

  it('renders the state list of suggestions', async () => {
    const { getSuggestionItemWrappers, popularSearches } = renderPopularSearches({
      popularSearches: [createPopularSearch('chocolate'), createPopularSearch('milk chocolate')]
    });
    await nextTick();
    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(popularSearches[index].query);
    });
  });

  it('allows to render a custom popular search', async () => {
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

    await nextTick();
    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.get('.custom-suggestion').text()).toEqual(
        `🔍${popularSearches[index].query}`
      );
      expect(itemWrapper.find(getDataTestSelector('popular-search')).exists()).toBe(false);
    });
  });

  it('allows to render a custom suggestion content', async () => {
    const { getSuggestionItemWrappers, popularSearches } = renderPopularSearches({
      popularSearches: [createPopularSearch('chocolate'), createPopularSearch('milk chocolate')],
      template: `
        <PopularSearches #suggestion-content="{ suggestion }">
          <span>🔍</span>
          <span>{{ suggestion.query }}</span>
        </PopularSearches>
      `
    });

    await nextTick();
    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(`🔍${popularSearches[index].query}`);
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
    expect(getSuggestionItemWrappers()).toHaveLength(popularSearches.length - 1);

    await setMaxItemsToRender(popularSearches.length);
    expect(getSuggestionItemWrappers()).toHaveLength(popularSearches.length);

    await setMaxItemsToRender(popularSearches.length + 1);
    expect(getSuggestionItemWrappers()).toHaveLength(popularSearches.length);
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
  wrapper: VueWrapper;
  /** Retrieves the list item of each suggestion. */
  getSuggestionItemWrappers: () => DOMWrapper<Element>[];
  /** Updates the maximum number of items to render. */
  setMaxItemsToRender: (max: number) => Promise<void>;
  /** Rendered suggestions data. */
  popularSearches: Suggestion[];
}
