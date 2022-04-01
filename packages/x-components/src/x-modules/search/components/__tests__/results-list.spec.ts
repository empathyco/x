import { Result } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor, ComponentOptions } from 'vue';
import Vuex, { Store } from 'vuex';
import Component from 'vue-class-component';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import BaseGrid from '../../../../components/base-grid.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial, ListItem } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import ResultsList from '../results-list.vue';
import { InfiniteScroll } from '../../../../directives/infinite-scroll/infinite-scroll.types';
import { XInject } from '../../../../components/decorators/injection.decorators';
import { LIST_ITEMS_KEY } from '../../../../components/decorators/injection.consts';
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
  components
}: RenderResultsListOptions = {}): RenderResultsListAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  XPlugin.resetInstance();

  resetXSearchStateWith(store, { results });
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

  const resultsListWrapper = wrapper.findComponent(ResultsList);

  return {
    wrapper: resultsListWrapper,
    getResults() {
      return results;
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
      `Custom result: ${getResults()[0].name}`
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

    const childWrapper = wrapper.find(Child);
    expect(childWrapper.text()).toBe(getResults()[0].id);
  });
});

interface RenderResultsListOptions {
  /** The template to be rendered. */
  template?: string;
  /** Components to be rendered. */
  components?: Dictionary<VueConstructor | ComponentOptions<Vue>>;
  /** The `results` used to be rendered. */
  results?: Result[];
}

interface RenderResultsListAPI {
  /** The `wrapper` wrapper component. */
  wrapper: Wrapper<Vue>;
  /** The `results` used to be rendered. */
  getResults: () => Result[];
}
