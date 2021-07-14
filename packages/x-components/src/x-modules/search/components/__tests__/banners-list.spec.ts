import { Banner } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import BaseGrid from '../../../../components/base-grid.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getBannersStub } from '../../../../__stubs__/banners-stubs.factory';
import BannersList from '../banners-list.vue';
import { resetXSearchStateWith } from './utils';

/**
 * Renders the `BannersList` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `BannersList` component.
 */
function renderBannersList({
  template = '<BannersList />',
  banners = getBannersStub(),
  components
}: RenderBannersListOptions = {}): RendersBannerListAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  XPlugin.resetInstance();

  resetXSearchStateWith(store, { banners });
  const wrapper = mount(
    {
      components: {
        BannersList,
        ...components
      },
      template
    },
    {
      localVue,
      store
    }
  );

  const bannersListWrapper = wrapper.findComponent(BannersList);

  return {
    bannersListWrapper,
    getBanners() {
      return banners;
    }
  };
}

describe('testing BannersList component', () => {
  it('is an XComponent', () => {
    const { bannersListWrapper } = renderBannersList();
    expect(isXComponent(bannersListWrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { bannersListWrapper } = renderBannersList();
    expect(getXComponentXModuleName(bannersListWrapper.vm)).toEqual('search');
  });

  it('renders the banners in the state', () => {
    const { bannersListWrapper, getBanners } = renderBannersList();
    const bannersListItems = bannersListWrapper.findAll(getDataTestSelector('banners-list-item'));

    getBanners().forEach((result, index) => {
      expect(bannersListItems.at(index).text()).toEqual(result.title);
    });
  });

  it('does not render any banner if the are none', () => {
    const { bannersListWrapper } = renderBannersList({ banners: [] });
    expect(bannersListWrapper.html()).toEqual('');
  });

  it('allows customizing the banner slot', () => {
    const { bannersListWrapper } = renderBannersList({
      template: `
        <BannersList>
          <template #banner="{ banner }">
            <p data-test="banner-slot-overridden">{{ banner.title }}</p>
          </template>
        </BannersList>`
    });

    expect(bannersListWrapper.find(getDataTestSelector('banners-list')).exists()).toBe(true);
    expect(bannersListWrapper.find(getDataTestSelector('banner-slot-overridden')).exists()).toBe(
      true
    );
  });

  it('allows customizing the default slot', () => {
    const { bannersListWrapper } = renderBannersList({
      template: `
        <BannersList>
          <template #default="{ banners }">
            <BaseGrid :items="banners" data-test="default-slot-overridden"/>
          </template>
        </BannersList>`,
      components: { BaseGrid }
    });

    expect(bannersListWrapper.find(getDataTestSelector('banners-list')).exists()).toBe(false);
    expect(bannersListWrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toBe(
      true
    );
  });
});

interface RenderBannersListOptions {
  /** The template to be rendered. */
  template?: string;
  /** Components to be rendered. */
  components?: { [p: string]: VueConstructor };
  /** The `banners` used to be rendered. */
  banners?: Banner[];
}

interface RendersBannerListAPI {
  /** The `bannersListWrapper` wrapper component. */
  bannersListWrapper: Wrapper<Vue>;
  /** The `banners` used to be rendered. */
  getBanners: () => Banner[];
}
