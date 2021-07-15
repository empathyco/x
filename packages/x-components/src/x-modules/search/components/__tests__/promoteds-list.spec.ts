import { Promoted } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor, ComponentOptions } from 'vue';
import Vuex, { Store } from 'vuex';
import BaseGrid from '../../../../components/base-grid.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial, Dictionary } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import PromotedsList from '../promoteds-list.vue';
import { getPromotedsStub } from '../../../../__stubs__/promoteds-stubs.factory';
import { resetXSearchStateWith } from './utils';

/**
 * Renders the `PromotedsList` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `ResultsList` component.
 */
function renderPromotedsList({
  template = '<PromotedsList />',
  promoteds = getPromotedsStub(),
  components
}: RenderPromotedsListOptions = {}): RenderPromotedsListAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  XPlugin.resetInstance();

  resetXSearchStateWith(store, { promoteds });
  const wrapper = mount(
    {
      components: {
        PromotedsList,
        ...components
      },
      template
    },
    {
      localVue,
      store
    }
  );

  const promotedsListWrapper = wrapper.findComponent(PromotedsList);

  return {
    wrapper: promotedsListWrapper,
    getPromoteds() {
      return promoteds;
    }
  };
}

describe('testing PromotedsList component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderPromotedsList();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { wrapper } = renderPromotedsList();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('search');
  });

  it('renders the promoteds in the state', () => {
    const { wrapper, getPromoteds } = renderPromotedsList();
    const promotedsListItems = wrapper.findAll(getDataTestSelector('promoteds-list-item'));

    getPromoteds().forEach((result, index) => {
      expect(promotedsListItems.at(index).text()).toEqual(result.title);
    });
  });

  it('does not render any promoted if the are none', () => {
    const { wrapper } = renderPromotedsList({ promoteds: [] });
    expect(wrapper.html()).toEqual('');
  });

  it('allows customizing the promoted slot', () => {
    const { wrapper, getPromoteds } = renderPromotedsList({
      template: `
        <PromotedsList>
          <template #promoted="{ promoted }">
            <p data-test="promoted-slot-overridden">Custom promoted: {{ promoted.title }}</p>
          </template>
        </PromotedsList>`
    });

    expect(wrapper.find(getDataTestSelector('promoteds-list')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('promoted-slot-overridden')).text()).toBe(
      `Custom promoted: ${getPromoteds()[0].title}`
    );
  });

  it('allows customizing the default slot', () => {
    const { wrapper } = renderPromotedsList({
      template: `
        <PromotedsList>
          <template #default="{ promoteds }">
            <p :items="promoteds" data-test="default-slot-overridden"/>
          </template>
        </PromotedsList>`,
      components: { BaseGrid }
    });

    expect(wrapper.find(getDataTestSelector('promoteds-list')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toBe(true);
  });
});

interface RenderPromotedsListOptions {
  /** The template to be rendered. */
  template?: string;
  /** Components to be rendered. */
  components?: Dictionary<VueConstructor | ComponentOptions<Vue>>;
  /** The `promoteds` used to be rendered. */
  promoteds?: Promoted[];
}

interface RenderPromotedsListAPI {
  /** The `wrapper` wrapper component. */
  wrapper: Wrapper<Vue>;
  /** The `promoteds` used to be rendered. */
  getPromoteds: () => Promoted[];
}
