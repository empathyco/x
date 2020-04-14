import { HistoryQuery as HistoryQueryModel } from '@empathy/search-types';
import { deepMerge } from '@empathybroker/deep-merge';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getDataTestSelector } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { SearchAdapterDummy } from '../../../../plugins/__tests__/adapter.dummy';
import { XPlugin } from '../../../../plugins/x-plugin';
import { DeepPartial } from '../../../../utils/types';
import { historyQueriesXStoreModule } from '../../store/module';
import { HistoryQueriesState } from '../../store/types';
import HistoryQueries from '../history-queries.vue';

describe('testing history queries component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store({});
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

  function resetStateWith(state: DeepPartial<HistoryQueriesState>): void {
    const newHistoryQueriesState = deepMerge(historyQueriesXStoreModule.state(), state);
    store.replaceState({
      x: {
        historyQueries: newHistoryQueriesState
      }
    });
  }

  beforeEach(() => {
    resetStateWith({});
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
    resetStateWith({ historyQueries });
    await localVue.nextTick();
    const historyQueryItemWrapper = historyQueriesWrapper.findAll(
      getDataTestSelector('history-query-item')
    );
    expect(historyQueryItemWrapper).toHaveLength(historyQueries.length);
  });

  it('limits the number of rendered elements by the maxItemsToRender config property', async () => {
    resetStateWith({
      historyQueries,
      config: {
        maxItemsToRender: 2
      }
    });
    await localVue.nextTick();
    const historyQueryItemWrapper = historyQueriesWrapper.findAll(
      getDataTestSelector('history-query-item')
    );
    expect(historyQueryItemWrapper).toHaveLength(2);
  });

  describe('test changing history query content', () => {
    it('allows changing history query content using scopedSlots', () => {
      resetStateWith({ historyQueries });
      const historyQueriesCustomizedWrapper = mount(HistoryQueries, {
        localVue,
        store,
        scopedSlots: {
          ['suggestion-content']:
            '<strong data-test="suggestion-content">{{ props.suggestion.query }}</strong>',
          ['suggestion-delete-content']: '<img  data-test="suggestion-delete-content" />'
        }
      });
      const suggestionContentWrappers = historyQueriesCustomizedWrapper.findAll(
        getDataTestSelector('suggestion-content')
      );

      const suggestionDeleteWrappers = historyQueriesCustomizedWrapper.findAll(
        getDataTestSelector('suggestion-delete-content')
      );

      expect(suggestionContentWrappers).toHaveLength(historyQueries.length);
      expect(suggestionDeleteWrappers).toHaveLength(historyQueries.length);
    });

    it('allows changing history query content using docs example as template', () => {
      resetStateWith({ historyQueries });

      const wrapperComponent = {
        template: `
           <HistoryQueries>
            <template #suggestion-content="{ suggestionQueryHighlighted }">
              <img src="./history-icon.svg" data-test="suggestion-history-icon"/>
              <span v-html="suggestionQueryHighlighted"></span>
            </template>
            <template #suggestion-delete-content>
              <img src="./delete-icon.svg" data-test="suggestion-delete-icon"/>
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

      const suggestionDeleteWrappers = historyQueriesCustomizedWrapper.findAll(
        getDataTestSelector('suggestion-delete-icon')
      );

      expect(suggestionContentWrappers).toHaveLength(historyQueries.length);
      expect(suggestionDeleteWrappers).toHaveLength(historyQueries.length);
    });
  });

  it('allows to change HistoryQuery component', () => {
    resetStateWith({ historyQueries });
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
