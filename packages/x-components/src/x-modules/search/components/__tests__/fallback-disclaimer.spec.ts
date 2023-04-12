import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import FallbackDisclaimer from '../fallback-disclaimer.vue';
import { RootXStoreState } from '../../../../store/index';
import { resetXSearchStateWith } from './utils';

function renderFallbackDisclaimer({
  template = `<FallbackDisclaimer/>`,
  query = '',
  isNoResultsWithFilters = false
}: RenderFallbackDisclaimerOptions = {}): RenderFallbackDisclaimerAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);
  resetXSearchStateWith(store, {
    query,
    isNoResultsWithFilters
  });
  const wrapper = mount(
    {
      components: {
        FallbackDisclaimer
      },
      template
    },
    {
      localVue,
      store
    }
  );

  return {
    wrapper
  };
}

describe('testing Fallback disclaimer component', () => {
  it('does not render any content when there is no results with filters', () => {
    const { wrapper } = renderFallbackDisclaimer();
    expect(wrapper.find(getDataTestSelector('fallback-disclaimer')).element).not.toBeDefined();
  });

  it('renders the message when there is no results with filters', async () => {
    const query = 'shirt';
    // eslint-disable-next-line max-len
    const message = `No results found for ${query} with the selected filters. The filters have been unselected.`;
    const { wrapper } = renderFallbackDisclaimer({ isNoResultsWithFilters: true, query });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(getDataTestSelector('fallback-disclaimer')).text()).toBe(message);
  });

  it('renders a custom fallback disclaimer message', async () => {
    const { wrapper } = renderFallbackDisclaimer({
      template: `
      <FallbackDisclaimer>
        <template #default="{ query }">
          No results found for '{{ query }}'. Filters deselected
        </template>
      </Fall>
      `,
      query: 'dress',
      isNoResultsWithFilters: true
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(getDataTestSelector('fallback-disclaimer')).text()).toBe(
      "No results found for 'dress'. Filters deselected"
    );
  });
});

interface RenderFallbackDisclaimerOptions {
  /** The template to be rendered. */
  template?: string;
  /** The query to display in the fallback disclaimer. */
  query?: string;
  /** Indicates if a request with filters applied had no results. */
  isNoResultsWithFilters?: boolean;
}

interface RenderFallbackDisclaimerAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
}
