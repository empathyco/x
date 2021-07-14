import { Result } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import BaseGrid from '../../../../components/base-grid.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import ResultsList from '../results-list.vue';
import { InfiniteScroll } from '../../../../directives/infinite-scroll/infinite-scroll.types';
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
    resultsListWrapper,
    getResults() {
      return results;
    }
  };
}

describe('testing Results list component', () => {
  it('is an XComponent', () => {
    const { resultsListWrapper } = renderResultsList();
    expect(isXComponent(resultsListWrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { resultsListWrapper } = renderResultsList();
    expect(getXComponentXModuleName(resultsListWrapper.vm)).toEqual('search');
  });

  it('renders the results in the state', () => {
    const { resultsListWrapper, getResults } = renderResultsList();
    const resultsListItems = resultsListWrapper.findAll(getDataTestSelector('results-list-item'));

    getResults().forEach((result, index) => {
      expect(resultsListItems.at(index).text()).toEqual(result.name);
    });
  });

  it('does not render any result if the are none', () => {
    const { resultsListWrapper } = renderResultsList({ results: [] });
    expect(resultsListWrapper.html()).toEqual('');
  });

  it('allows customizing the result slot', () => {
    const { resultsListWrapper } = renderResultsList({
      template: `
        <ResultsList>
          <template #result="{ result }">
            <p data-test="result-slot-overridden">{{ result.name }}</p>
          </template>
        </ResultsList>`
    });

    expect(resultsListWrapper.find(getDataTestSelector('results-list')).exists()).toBe(true);
    expect(resultsListWrapper.find(getDataTestSelector('result-slot-overridden')).exists()).toBe(
      true
    );
  });

  it('allows customizing the default slot', () => {
    const { resultsListWrapper } = renderResultsList({
      template: `
        <ResultsList>
          <template #default="{ results }">
            <BaseGrid :items="results" data-test="layout-slot-overridden"/>
          </template>
        </ResultsList>`,
      components: { BaseGrid }
    });

    expect(resultsListWrapper.find(getDataTestSelector('results-list')).exists()).toBe(false);
    expect(resultsListWrapper.find(getDataTestSelector('layout-slot-overridden')).exists()).toBe(
      true
    );
  });

  it('emits an `UserReachedResultListEnd` X event when onInfiniteScrollEnd is called', () => {
    const { resultsListWrapper } = renderResultsList();

    const listener = jest.fn();
    resultsListWrapper.vm.$x.on('UserReachedResultsListEnd').subscribe(listener);

    (resultsListWrapper.vm as Vue & InfiniteScroll).onInfiniteScrollEnd();

    expect(listener).toHaveBeenCalledTimes(1);
  });
});

interface RenderResultsListOptions {
  /** The template to be rendered. */
  template?: string;
  /** Components to be rendered. */
  components?: { [p: string]: VueConstructor };
  /** The `results` used to be rendered. */
  results?: Result[];
}

interface RenderResultsListAPI {
  /** The `resultsListWrapper` wrapper component. */
  resultsListWrapper: Wrapper<Vue>;
  /** The `results` used to be rendered. */
  getResults: () => Result[];
}
