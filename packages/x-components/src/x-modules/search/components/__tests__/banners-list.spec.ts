import { Banner, Result } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor, ComponentOptions } from 'vue';
import Vuex, { Store } from 'vuex';
import { Component } from 'vue-property-decorator';
import BaseGrid from '../../../../components/base-grid.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial, Dictionary, SearchItem } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getBannersStub } from '../../../../__stubs__/banners-stubs.factory';
import BannersList from '../banners-list.vue';
import { SEARCH_ITEMS_KEY } from '../../../../components/decorators/injection.consts';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { XProvide } from '../../../../components/decorators/injection.decorators';
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
    wrapper: bannersListWrapper,
    getBanners() {
      return banners;
    }
  };
}

describe('testing BannersList component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderBannersList();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { wrapper } = renderBannersList();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('search');
  });

  it('renders the banners in the state', () => {
    const { wrapper, getBanners } = renderBannersList();
    const bannersListItems = wrapper.findAll(getDataTestSelector('banners-list-item'));

    getBanners().forEach((result, index) => {
      expect(bannersListItems.at(index).text()).toEqual(result.title);
    });
  });

  it('does not render any banner if the are none', () => {
    const { wrapper } = renderBannersList({ banners: [] });
    expect(wrapper.html()).toEqual('');
  });

  it('allows customizing the banner slot', () => {
    const { wrapper, getBanners } = renderBannersList({
      template: `
        <BannersList>
          <template #banner="{ banner }">
            <p data-test="banner-slot-overridden">Custom banner: {{ banner.title }}</p>
          </template>
        </BannersList>`
    });

    expect(wrapper.find(getDataTestSelector('banners-list')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('banner-slot-overridden')).text()).toBe(
      `Custom banner: ${getBanners()[0].title}`
    );
  });

  it('allows customizing the default slot', () => {
    const { wrapper } = renderBannersList({
      template: `
        <BannersList>
          <template #default="{ banners }">
            <p data-test="default-slot-overridden"/>
          </template>
        </BannersList>`,
      components: { BaseGrid }
    });

    expect(wrapper.find(getDataTestSelector('banners-list')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toBe(true);
  });

  it('provides', () => {
    const resultStub = getResultsStub().slice(0, 1);
    const bannerStub = getBannersStub().slice(0, 1);
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);
    resetXSearchStateWith(store, { banners: bannerStub });

    @Component({
      template: `<div><slot/></div>`
    })
    class Provider extends Vue {
      @XProvide(SEARCH_ITEMS_KEY)
      public providedStub: Result[] = resultStub;
    }

    const wrapper = mount(
      {
        template: '<Provider v-bind="$attrs"><BannersList><BaseGrid/></BannersList></Provider>',
        components: {
          Provider,
          BannersList,
          BaseGrid
        }
      },
      {
        localVue,
        store
      }
    );

    expect(wrapper.text()).toBe('Banner 1');
  });
});

interface RenderBannersListOptions {
  /** The template to be rendered. */
  template?: string;
  /** Components to be rendered. */
  components?: Dictionary<VueConstructor | ComponentOptions<Vue>>;
  /** The `banners` used to be rendered. */
  banners?: Banner[];
}

interface RendersBannerListAPI {
  /** The `wrapper` wrapper component. */
  wrapper: Wrapper<Vue>;
  /** The `banners` used to be rendered. */
  getBanners: () => Banner[];
}
