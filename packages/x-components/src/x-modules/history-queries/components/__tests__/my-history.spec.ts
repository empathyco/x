import { HistoryQuery } from '@empathyco/x-types';
import { DeepPartial, forEach } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createHistoryQueries } from '../../../../__stubs__/history-queries-stubs.factory';
import { RootXStoreState } from '../../../../store/store.types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { baseSnippetConfig } from '../../../../views/base-config';
import { historyQueriesXModule } from '../../x-module';
import MyHistory from '../my-history.vue';
import { resetXHistoryQueriesStateWith } from './utils';

function renderMyHistory({
  template = '<MyHistory />',
  historyQueries = []
}: MyHistoryOptions = {}): MyHistoryAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [historyQueriesXModule] }, localVue);
  resetXHistoryQueriesStateWith(store, { historyQueries });

  const wrapper = mount(
    {
      template,
      components: {
        MyHistory
      },
      provide: {
        snippetConfig: {
          ...baseSnippetConfig,
          lang: 'en'
        }
      }
    },
    {
      localVue,
      store
    }
  );
  return {
    wrapper: wrapper.findComponent(MyHistory),
    search(query) {
      wrapper.vm.$x.emit('UserAcceptedAQuery', query);
      return wrapper.vm.$nextTick();
    },
    getListItems() {
      return wrapper.findAll(getDataTestSelector('suggestion-item'));
    },
    findAllInWrapper(selector) {
      return wrapper.findAll(getDataTestSelector(selector)).wrappers;
    }
  };
}

describe('testing MyHistory component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderMyHistory();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries');
  });

  it('does not render the component if history is empty', () => {
    const { wrapper } = renderMyHistory();
    expect(wrapper.html()).toEqual('');
  });

  it('renders the list of searched queries group by date', () => {
    const historyQueries: HistoryQuery[] = [
      {
        query: 'lego',
        timestamp: 1650286901802,
        modelName: 'HistoryQuery'
      },
      {
        query: 'barbie',
        timestamp: 1650286895254,
        modelName: 'HistoryQuery'
      },
      {
        query: 'truck',
        timestamp: 1649230515242,
        modelName: 'HistoryQuery'
      },
      {
        query: 'doll',
        timestamp: 1649230513535,
        modelName: 'HistoryQuery'
      }
    ];

    const { findAllInWrapper } = renderMyHistory({
      historyQueries: historyQueries
    });

    const historyWrappers = findAllInWrapper('my-history-item');

    forEach(
      {
        'Monday, April 18, 2022': [historyQueries[0], historyQueries[1]],
        'Wednesday, April 6, 2022': [historyQueries[2], historyQueries[3]]
      },
      (date, historyQueries, index) => {
        const groupWrapper = historyWrappers.at(index);
        const historyItemWrappers = groupWrapper?.findAll(
          getDataTestSelector('history-query-item')
        );
        expect(groupWrapper?.find(getDataTestSelector('my-history-date')).text()).toBe(date);
        historyQueries.forEach((historyQuery, historyQueryIndex) => {
          const hour = new Date(historyQuery.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          expect(historyItemWrappers?.at(historyQueryIndex).text()).toEqual(
            `${historyQuery.query} ${hour} ✕`
          );
        });
      }
    );
  });

  it('allows changing history query content and render the list of history queries', () => {
    const historyQueries = createHistoryQueries(
      'moura',
      'calamares',
      'rubia galega',
      'pulpo',
      'cachelos',
      'navajas',
      'croquetas',
      'zamburiñas'
    );

    const { findAllInWrapper } = renderMyHistory({
      template: `
          <MyHistory>
            <template #suggestion-content="{suggestion, index}">
              <img src="./history-icon.svg" data-test="suggestion-history-icon"/>
              <span :data-index="index"
                    data-test="suggestion-content-slot"
                    v-html="suggestion.query"></span>
            </template>
            <template #suggestion-remove-content>
              <img src="./remove-icon.svg" data-test="suggestion-remove-icon"/>
            </template>
          </MyHistory>
        `,
      historyQueries
    });

    const suggestionIconWrappers = findAllInWrapper('suggestion-history-icon');
    const suggestionRemoveIconWrappers = findAllInWrapper('suggestion-remove-icon');
    const suggestionContentWrappers = findAllInWrapper('suggestion-content-slot');

    expect(suggestionIconWrappers).toHaveLength(historyQueries.length);
    expect(suggestionRemoveIconWrappers).toHaveLength(historyQueries.length);
    expect(suggestionContentWrappers).toHaveLength(historyQueries.length);
    suggestionContentWrappers.forEach((contentWrapper, index) => {
      expect(contentWrapper.attributes('data-index')).toEqual(index.toString());
      expect(contentWrapper.text()).toEqual(historyQueries[index].query);
    });
  });
});

/**
 * The options for the `renderMyHistory` function.
 */
interface MyHistoryOptions {
  /** The template to render.*/
  template?: string;
  /** List of {@link HistoryQuery} that are going to be rendered. */
  historyQueries?: HistoryQuery[];
}

/**
 * Test API for the {@link MyHistory} component.
 */
interface MyHistoryAPI {
  /** The wrapper for my history component. */
  wrapper: Wrapper<Vue>;
  /** Helper method to search a query. */
  search: (query: string) => Promise<void>;
  /** Retrieves the wrapper for the items of the list rendered by the {@link MyHistory}
   * component. */
  getListItems: () => WrapperArray<Vue>;
  /** Retrieves the wrapper for the items that matches with the selector. */
  findAllInWrapper: (selector: string) => Wrapper<Vue>[];
}
