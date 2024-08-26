import { PartialResult } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { Store } from 'vuex';
import { nextTick } from 'vue';
import { getPartialResultsStub } from '../../../../__stubs__/partials-results-stubs.factory';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import PartialResultsList from '../partial-results-list.vue';
import { searchXModule } from '../../x-module';
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
}: RenderPartialResultsListOptions = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(
    {
      components: {
        PartialResultsList
      },
      template
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] })]
      },
      store
    }
  );

  resetXSearchStateWith(store, { partialResults });

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

  it('renders the partial results in the state', async () => {
    const { partialResultsListWrapper, getPartialResults } = renderPartialResultsList();
    await nextTick();
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

  it('allows customizing the default slot', async () => {
    const { partialResultsListWrapper } = renderPartialResultsList({
      template: `
        <PartialResultsList>
          <template #default="{ partialResult }">
            <p data-test="partial-slot-overridden">{{ partialResult.query }}</p>
          </template>
        </PartialResultsList>`
    });

    await nextTick();

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
