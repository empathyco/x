import { HistoryQuery } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { createHistoryQueries } from '../../../../__stubs__/history-queries-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { historyQueriesXModule } from '../../x-module';
import HistoryQueries from '../history-queries.vue';
import { resetXHistoryQueriesStateWith } from './utils';

function renderHistoryQueries({
  historyQueries = createHistoryQueries('chocolate', 'milk chocolate', 'chocolate milk'),
  maxItemsToRender,
  template = '<HistoryQueries v-bind="$attrs" />'
}: RenderHistoryQueriesOptions = {}): RenderHistoryQueriesApi {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [historyQueriesXModule] }, localVue);
  resetXHistoryQueriesStateWith(store, { historyQueries });

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: {
        HistoryQueries
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
    wrapper: wrapper.findComponent(HistoryQueries),
    historyQueries,
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
    const { wrapper } = renderHistoryQueries();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries');
  });

  it('does not render anything when suggestions are empty', () => {
    const { wrapper } = renderHistoryQueries({ historyQueries: [] });
    expect(wrapper.html()).toBe('');
  });

  it('renders the state list of suggestions', () => {
    const { getSuggestionItemWrappers, historyQueries } = renderHistoryQueries({
      historyQueries: createHistoryQueries('chocolate', 'milk chocolate')
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(`${historyQueries[index].query}✕`);
    });
  });

  it('allows to render a custom query suggestion', () => {
    const { getSuggestionItemWrappers, historyQueries } = renderHistoryQueries({
      historyQueries: createHistoryQueries('chocolate', 'milk chocolate'),
      template: `
        <HistoryQueries #suggestion="{ suggestion }">
          <button class="custom-suggestion">
            <span>🔍</span>
            <span>{{ suggestion.query }}</span>
          </button>
        </HistoryQueries>
      `
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.get('.custom-suggestion').text()).toEqual(
        `🔍 ${historyQueries[index].query}`
      );
      expect(itemWrapper.find(getDataTestSelector('history-query')).exists()).toBe(false);
    });
  });

  it('allows to render a custom suggestion content', () => {
    const { getSuggestionItemWrappers, historyQueries } = renderHistoryQueries({
      historyQueries: createHistoryQueries('chocolate', 'milk chocolate'),
      template: `
        <HistoryQueries #suggestion-content="{ suggestion }">
          <span>🔍</span>
          <span>{{ suggestion.query }}</span>
        </HistoryQueries>
      `
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(`🔍 ${historyQueries[index].query}✕`);
      expect(itemWrapper.find(getDataTestSelector('history-query')).exists()).toBe(true);
    });
  });

  it('allows to render a custom remove suggestion content', () => {
    const { getSuggestionItemWrappers, historyQueries } = renderHistoryQueries({
      historyQueries: createHistoryQueries('chocolate', 'milk chocolate'),
      template: `
        <HistoryQueries #suggestion-remove-content="{ suggestion }">
          <span>❌</span>
          <span>{{ suggestion.query }}</span>
        </HistoryQueries>
      `
    });

    const suggestionItemWrappers = getSuggestionItemWrappers();
    expect(suggestionItemWrappers).toHaveLength(2);
    suggestionItemWrappers.wrappers.forEach((itemWrapper, index) => {
      const query = historyQueries[index].query;
      expect(itemWrapper.text()).toEqual(`${query}❌ ${query}`);
      expect(itemWrapper.find(getDataTestSelector('history-query')).exists()).toBe(true);
    });
  });

  // eslint-disable-next-line max-len
  it('renders at most the number of HistoryQuery defined by `maxItemsToRender` prop', async () => {
    const { getSuggestionItemWrappers, setMaxItemsToRender, historyQueries } = renderHistoryQueries(
      {
        historyQueries: createHistoryQueries('shirt', 'jeans', 'tshirt', 'jumper')
      }
    );

    await setMaxItemsToRender(historyQueries.length - 1);
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(historyQueries.length - 1);

    await setMaxItemsToRender(historyQueries.length);
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(historyQueries.length);

    await setMaxItemsToRender(historyQueries.length + 1);
    expect(getSuggestionItemWrappers().wrappers).toHaveLength(historyQueries.length);
  });
});

interface RenderHistoryQueriesOptions {
  /** The suggestions list to render. */
  historyQueries?: HistoryQuery[];
  /** The maximum number of items to render. */
  maxItemsToRender?: string;
  /** The template to render. */
  template?: string;
}

interface RenderHistoryQueriesApi {
  /** HistoryQueries component testing wrapper. */
  wrapper: Wrapper<Vue>;
  /** Retrieves the list item of each suggestion. */
  getSuggestionItemWrappers: () => WrapperArray<Vue>;
  /** Retrieves the list item of each suggestion. */
  setMaxItemsToRender: (max: number) => Promise<void>;
  /** Rendered suggestions data. */
  historyQueries: HistoryQuery[];
}
