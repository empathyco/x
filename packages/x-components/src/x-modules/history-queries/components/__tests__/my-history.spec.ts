import { HistoryQuery } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createHistoryQueries } from '../../../../__stubs__/index';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/index';
import { RootXStoreState } from '../../../../store/index';
import { DeepPartial } from '../../../../utils/index';
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
      }
    },
    {
      localVue,
      store,
      propsData: {
        historyQueries
      }
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
      return wrapper.findAll(getDataTestSelector(selector));
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

  it('renders the list of searched queries', async () => {
    const { search, getListItems } = renderMyHistory();

    await search('lego');
    const suggestionsWrappers = getListItems();
    expect(suggestionsWrappers.wrappers).toHaveLength(1);
    expect(suggestionsWrappers.at(0).text()).toEqual('lego ✕');
  });

  describe('changing history query content', () => {
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
            <template #suggestion-content="suggestionContentScope">
              <img src="./history-icon.svg" data-test="suggestion-history-icon"/>
              <span :data-index="suggestionContentScope.index"
                    v-html="suggestionContentScope.queryHTML"></span>
            </template>
            <template #suggestion-remove-content>
              <img src="./remove-icon.svg" data-test="suggestion-remove-icon"/>
            </template>
          </MyHistory>
        `,
        historyQueries
      });

      const suggestionContentWrappers = findAllInWrapper('suggestion-history-icon');
      const suggestionRemoveWrappers = findAllInWrapper('suggestion-remove-icon');

      expect(suggestionContentWrappers).toHaveLength(historyQueries.length);
      expect(suggestionRemoveWrappers).toHaveLength(historyQueries.length);
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
  findAllInWrapper: (selector: string) => WrapperArray<Vue>;
}
