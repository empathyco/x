import { Promoted } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import BaseGrid from '../../../../components/base-grid.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { InfiniteScroll } from '../../../../directives/infinite-scroll/infinite-scroll.types';
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
    promotedsListWrapper,
    getPromoteds() {
      return promoteds;
    }
  };
}

describe('testing PromotedsList component', () => {
  it('is an XComponent', () => {
    const { promotedsListWrapper } = renderPromotedsList();
    expect(isXComponent(promotedsListWrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { promotedsListWrapper } = renderPromotedsList();
    expect(getXComponentXModuleName(promotedsListWrapper.vm)).toEqual('search');
  });

  it('renders the promoteds in the state', () => {
    const { promotedsListWrapper, getPromoteds } = renderPromotedsList();
    const promotedsListItems = promotedsListWrapper.findAll(
      getDataTestSelector('promoteds-list-item')
    );

    getPromoteds().forEach((result, index) => {
      expect(promotedsListItems.at(index).text()).toEqual(result.title);
    });
  });

  it('does not render any promoted if the are none', () => {
    const { promotedsListWrapper } = renderPromotedsList({ promoteds: [] });
    expect(promotedsListWrapper.html()).toEqual('');
  });

  it('allows customizing the promoted slot', () => {
    const { promotedsListWrapper } = renderPromotedsList({
      template: `
        <PromotedsList>
          <template #promoted="{ promoted }">
            <p data-test="promoted-slot-overridden">{{ promoted.title }}</p>
          </template>
        </PromotedsList>`
    });

    expect(promotedsListWrapper.find(getDataTestSelector('promoteds-list')).exists()).toBe(true);
    expect(
      promotedsListWrapper.find(getDataTestSelector('promoted-slot-overridden')).exists()
    ).toBe(true);
  });

  it('allows customizing the default slot', () => {
    const { promotedsListWrapper } = renderPromotedsList({
      template: `
        <PromotedsList>
          <template #default="{ banners }">
            <BaseGrid :items="banners" data-test="default-slot-overridden"/>
          </template>
        </PromotedsList>`,
      components: { BaseGrid }
    });

    expect(promotedsListWrapper.find(getDataTestSelector('banners-list')).exists()).toBe(false);
    expect(promotedsListWrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toBe(
      true
    );
  });
});

interface RenderPromotedsListOptions {
  /** The template to be rendered. */
  template?: string;
  /** Components to be rendered. */
  components?: { [p: string]: VueConstructor };
  /** The `promoteds` used to be rendered. */
  promoteds?: Promoted[];
}

interface RenderPromotedsListAPI {
  /** The `promotedsListWrapper` wrapper component. */
  promotedsListWrapper: Wrapper<Vue>;
  /** The `promoteds` used to be rendered. */
  getPromoteds: () => Promoted[];
}
