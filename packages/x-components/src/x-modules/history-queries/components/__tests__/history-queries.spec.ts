import { HistoryQuery as HistoryQueryModel } from '@empathy/search-types';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { SearchAdapterDummy } from '../../../../__tests__/adapter.dummy';
import { getDataTestSelector } from '../../../../__tests__/utils';
import HistoryQueries from '../history-queries.vue';
import { resetXHistoryQueriesStateWith } from './utils';

describe('testing history queries component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  localVue.use(XPlugin, { adapter: SearchAdapterDummy, store });

  const historyQueries: HistoryQueryModel[] = [
    {
      query: 'moura',
      modelName: 'HistoryQuery',
      timestamp: 0
    },
    {
      query: 'calamares',
      modelName: 'HistoryQuery',
      timestamp: 0
    },
    {
      query: 'rubia galega',
      modelName: 'HistoryQuery',
      timestamp: 0
    }
  ];

  const historyQueriesWrapper = mount(HistoryQueries, {
    localVue,
    store
  });

  beforeEach(() => {
    resetXHistoryQueriesStateWith(store);
  });

  it('is an XComponent which has an XModule', () => {
    expect(isXComponent(historyQueriesWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(historyQueriesWrapper.vm)).toEqual('historyQueries');
  });

  it('does not render the component if history is empty', () => {
    expect(historyQueriesWrapper.html()).toEqual('');
  });

  // eslint-disable-next-line max-len
  it('renders the same number of elements than queries has the store if less than maxItemsToRender configuration', async () => {
    resetXHistoryQueriesStateWith(store, { historyQueries });
    await localVue.nextTick();
    const historyQueryItemWrapper = historyQueriesWrapper.findAll(
      getDataTestSelector('history-query-item')
    );
    expect(historyQueryItemWrapper).toHaveLength(historyQueries.length);
  });

  it('limits the number of rendered elements by the maxItemsToRender config property', async () => {
    resetXHistoryQueriesStateWith(store, {
      historyQueries,
      config: { maxItemsToRender: 2 }
    });
    await localVue.nextTick();
    const historyQueryItemWrapper = historyQueriesWrapper.findAll(
      getDataTestSelector('history-query-item')
    );
    expect(historyQueryItemWrapper).toHaveLength(2);
  });

  describe('test changing history query content', () => {
    it('allows changing history query content using scopedSlots', () => {
      resetXHistoryQueriesStateWith(store, { historyQueries });
      const historyQueriesCustomizedWrapper = mount(HistoryQueries, {
        localVue,
        store,
        scopedSlots: {
          ['suggestion-content']:
            '<strong data-test="suggestion-content">{{ props.suggestion.query }}</strong>',
          ['suggestion-remove-content']: '<img  data-test="suggestion-remove-content" />'
        }
      });
      const suggestionContentWrappers = historyQueriesCustomizedWrapper.findAll(
        getDataTestSelector('suggestion-content')
      );

      const suggestionRemoveWrappers = historyQueriesCustomizedWrapper.findAll(
        getDataTestSelector('suggestion-remove-content')
      );

      expect(suggestionContentWrappers).toHaveLength(historyQueries.length);
      expect(suggestionRemoveWrappers).toHaveLength(historyQueries.length);
    });

    it('allows changing history query content using docs example as template', () => {
      resetXHistoryQueriesStateWith(store, { historyQueries });

      const wrapperComponent = {
        template: `
           <HistoryQueries>
            <template #suggestion-content="{ suggestionQueryHighlighted }">
              <img src="./history-icon.svg" data-test="suggestion-history-icon"/>
              <span v-html="suggestionQueryHighlighted"></span>
            </template>
            <template #suggestion-remove-content>
              <img src="./remove-icon.svg" data-test="suggestion-remove-icon"/>
            </template>
          </HistoryQueries>
        `,
        components: {
          HistoryQueries
        }
      };
      const historyQueriesCustomizedWrapper = mount(wrapperComponent, {
        localVue,
        store
      });
      const suggestionContentWrappers = historyQueriesCustomizedWrapper.findAll(
        getDataTestSelector('suggestion-history-icon')
      );

      const suggestionRemoveWrappers = historyQueriesCustomizedWrapper.findAll(
        getDataTestSelector('suggestion-remove-icon')
      );

      expect(suggestionContentWrappers).toHaveLength(historyQueries.length);
      expect(suggestionRemoveWrappers).toHaveLength(historyQueries.length);
    });
  });

  it('allows to change HistoryQuery component', () => {
    resetXHistoryQueriesStateWith(store, { historyQueries });
    const historyQueriesCustomizedWrapper = mount(HistoryQueries, {
      localVue,
      store,
      scopedSlots: {
        suggestion:
          '<span data-test="suggestion-mock-component">{{ props.suggestion.query }}</span>'
      }
    });
    const historyQueriesWrapper = historyQueriesCustomizedWrapper.findAll(
      getDataTestSelector('suggestion-mock-component')
    );

    expect(historyQueriesWrapper).toHaveLength(historyQueries.length);
  });
});
