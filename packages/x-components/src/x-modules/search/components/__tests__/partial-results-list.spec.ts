import { PartialResult } from '@empathyco/x-types-old';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getPartialResultsStub } from '../../../../__stubs__/partials-results-stubs.factory';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import PartialResultsList from '../partial-results-list.vue';
import { resetXSearchStateWith } from './utils';

/**
 * Renders the `PartialResultsList` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `PartialResultsList` component.
 */
function renderPartialResultsList({
  template = '<PartialResultsList />',
  partialResults = getPartialResultsStub()
}: RenderPartialResultsListOptions = {}): RenderPartialResultsListAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  XPlugin.resetInstance();

  resetXSearchStateWith(store, { partialResults });

  const wrapper = mount(
    {
      components: {
        PartialResultsList
      },
      template
    },
    {
      localVue,
      store
    }
  );

  const partialResultsListWrapper = wrapper.findComponent(PartialResultsList);

  return {
    partialResultsListWrapper,
    getPartialResults() {
      return partialResults;
    }
  };
}
describe('testing Partial results list component', () => {
  it('is an XComponent', () => {
    const { partialResultsListWrapper } = renderPartialResultsList();
    expect(isXComponent(partialResultsListWrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { partialResultsListWrapper } = renderPartialResultsList();
    expect(getXComponentXModuleName(partialResultsListWrapper.vm)).toEqual('search');
  });

  it('renders the partial results in the state', () => {
    const { partialResultsListWrapper, getPartialResults } = renderPartialResultsList();
    const partialResultsItems = partialResultsListWrapper.findAll(
      getDataTestSelector('partial-result')
    );
    expect(partialResultsItems).toHaveLength(getPartialResults().length);
  });

  it('does not render any partial results if the are none', () => {
    const { partialResultsListWrapper } = renderPartialResultsList({ partialResults: [] });
    expect(partialResultsListWrapper.find(getDataTestSelector('partial-results')).exists()).toBe(
      false
    );
  });

  it('allows customizing the default slot', () => {
    const { partialResultsListWrapper } = renderPartialResultsList({
      template: `
        <PartialResultsList>
          <template #default="{ partialResult }">
            <p data-test="partial-slot-overridden">{{ partialResult.query }}</p>
          </template>
        </PartialResultsList>`
    });

    expect(partialResultsListWrapper.find(getDataTestSelector('partial-results')).exists()).toBe(
      true
    );
    expect(
      partialResultsListWrapper.find(getDataTestSelector('partial-slot-overridden')).exists()
    ).toBe(true);
  });
});

interface RenderPartialResultsListOptions {
  /** The template to be rendered. */
  template?: string;
  /** The `partialResults` to be rendered. */
  partialResults?: PartialResult[];
}

interface RenderPartialResultsListAPI {
  /** The `partialResultsList` wrapper component. */
  partialResultsListWrapper: Wrapper<Vue>;
  /** Helper method with the `partialResults` to be rendered. */
  getPartialResults: () => PartialResult[];
}
