import { Result } from '@empathyco/x-types';
import { DeepPartial, Dictionary } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, VueClass } from '@vue/test-utils';
import Vue, { VueConstructor, ComponentOptions } from 'vue';
import Vuex, { Store } from 'vuex';
import Component from 'vue-class-component';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import BaseGrid from '../../../../components/base-grid.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { ListItem } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import ResultsList from '../results-list.vue';
import { InfiniteScroll } from '../../../../directives/infinite-scroll/infinite-scroll.types';
import { XInject } from '../../../../components/decorators/injection.decorators';
import {
  HAS_MORE_ITEMS_KEY,
  LIST_ITEMS_KEY,
  QUERY_KEY
} from '../../../../components/decorators/injection.consts';
import { SearchMutations } from '../../store/types';
import { searchXModule } from '../../x-module';
import { resetXSearchStateWith } from './utils';

/**
 * Renders the `ResultsList` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `ResultsList` component.
 */
function renderResultsList({
  template = '<ResultsList />',
  results = getResultsStub(),
  totalResults = results.length,
  components
}: RenderResultsListOptions = {}): RenderResultsListAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin(
    {
      store,
      initialXModules: [searchXModule]
    },
    localVue
  );
  resetXSearchStateWith(store, { results, totalResults });

  const wrapper = mount(
    {
      components: {
        ResultsList,
        ...components
      },
      template
    },
    {
      localVue,
      store
    }
  );

  return {
    wrapper: wrapper.findComponent(ResultsList),
    getResults() {
      return results;
    },
    commit(event, payload) {
      store.commit(`x/search/${event}`, payload);
    }
  };
}

describe('testing Results list component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderResultsList();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { wrapper } = renderResultsList();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('search');
  });

  it('renders the results in the state', () => {
    const { wrapper, getResults } = renderResultsList();
    const resultsListItems = wrapper.findAll(getDataTestSelector('results-list-item'));

    getResults().forEach((result, index) => {
      expect(resultsListItems.at(index).text()).toEqual(result.id);
    });
  });

  it('does not render any result if the are none', () => {
    const { wrapper } = renderResultsList({ results: [] });
    expect(wrapper.html()).toEqual('');
  });

  it('allows customizing the result slot', () => {
    const { wrapper, getResults } = renderResultsList({
      template: `
        <ResultsList>
          <template #result="{ item }">
            <p data-test="result-slot-overridden">Custom result: {{ item.name }}</p>
          </template>
        </ResultsList>`
    });

    expect(wrapper.classes('x-items-list')).toBe(true);
    expect(wrapper.find(getDataTestSelector('results-list-item')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('result-slot-overridden')).text()).toBe(
      `Custom result: ${getResults()[0].name!}`
    );
  });

  it('allows customizing the default slot', () => {
    const { wrapper } = renderResultsList({
      template: `
        <ResultsList>
          <template #default="{ results }">
            <p :items="results" data-test="default-slot-overridden"/>
          </template>
        </ResultsList>`,
      components: { BaseGrid }
    });

    expect(wrapper.find(getDataTestSelector('results-list')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toBe(true);
  });

  it('emits an `UserReachedResultListEnd` X event when onInfiniteScrollEnd is called', () => {
    const { wrapper } = renderResultsList();

    const listener = jest.fn();
    wrapper.vm.$x.on('UserReachedResultsListEnd').subscribe(listener);

    (wrapper.vm as Vue & InfiniteScroll).onInfiniteScrollEnd();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('provides the results from state with the key `item`', () => {
    @Component({
      template: `
        <div>{{ items[0].id }}</div>
      `
    })
    class Child extends Vue {
      @XInject(LIST_ITEMS_KEY)
      public items!: ListItem[];
    }

    const { wrapper, getResults } = renderResultsList({
      template: '<ResultsList><Child /></ResultsList>',
      components: {
        Child
      }
    });

    const childWrapper = wrapper.findComponent(Child);
    expect(childWrapper.text()).toBe(getResults()[0].id);
  });

  // eslint-disable-next-line max-len
  it('provides the query with the key `query`, only updating it if the status is success', async () => {
    @Component({
      template: `
        <div>{{ searchQuery }}</div>
      `
    })
    class Child extends Vue {
      @XInject(QUERY_KEY)
      public searchQuery!: string;
    }

    const { wrapper, commit } = renderResultsList({
      template: `<ResultsList><Child/></ResultsList>`,
      components: {
        Child
      }
    });

    const childWrapper = wrapper.findComponent(Child);

    // Initially, the query should be empty, because the request has not been made yet.
    expect(childWrapper.text()).toBeFalsy();

    commit('setQuery', 'tshirt');
    commit('setStatus', 'loading');
    await wrapper.vm.$nextTick();

    // The injected query shouldn't change if the status is loading.
    expect(childWrapper.text()).toBeFalsy();

    commit('setStatus', 'success');
    await wrapper.vm.$nextTick();

    // The query should have changed to `tshirt` because the request has succeeded.
    expect(childWrapper.text()).toBe('tshirt');

    commit('setQuery', 'jacket');
    commit('setStatus', 'loading');
    await wrapper.vm.$nextTick();

    // Here the injected query should be `tshirt` because the request for jacket is loading.
    expect(childWrapper.text()).toBe('tshirt');

    commit('setStatus', 'success');
    await wrapper.vm.$nextTick();

    // Finally, when the request for `jacket` has been completed,
    // the injected query should be updated.
    expect(childWrapper.text()).toBe('jacket');
  });

  it('provides a flag indicating if there are more results with the key `hasMoreItems`', () => {
    @Component({
      template: `
        <div></div>
      `
    })
    class Child extends Vue {
      @XInject(HAS_MORE_ITEMS_KEY)
      public hasMoreItems!: boolean;
    }

    const { commit, wrapper } = renderResultsList({
      template: '<ResultsList><Child /></ResultsList>',
      components: {
        Child
      }
    });

    const childWrapper = wrapper.findComponent(Child as VueClass<Child>);

    // Initially, the number of `items` and `totalResults` should match.
    expect(childWrapper.vm.hasMoreItems).toBe(false);

    commit('setTotalResults', 1000);

    // Now the `totalResults` is higher than the number of `items`
    expect(childWrapper.vm.hasMoreItems).toBe(true);
  });
});

interface RenderResultsListOptions {
  /** The template to be rendered. */
  template?: string;
  /** Components to be rendered. */
  components?: Dictionary<VueConstructor | ComponentOptions<Vue>>;
  /** The `results` used to be rendered. */
  results?: Result[];
  /** The total number of results. */
  totalResults?: number;
}

interface RenderResultsListAPI {
  /** The `wrapper` wrapper component. */
  wrapper: Wrapper<Vue>;
  /** The `results` used to be rendered. */
  getResults: () => Result[];
  /** Commits a mutation to the search store. */
  commit: <Event extends keyof SearchMutations>(
    event: Event,
    payload: Parameters<SearchMutations[Event]>[0]
  ) => void;
}
