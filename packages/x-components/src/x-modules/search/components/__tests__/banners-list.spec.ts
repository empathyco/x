import { Banner } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { computed, defineComponent, provide, inject, Ref, nextTick } from 'vue';
import { Store } from 'vuex';
import BaseGrid from '../../../../components/base-grid.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { ListItem } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getBannersStub } from '../../../../__stubs__/banners-stubs.factory';
import BannersList from '../banners-list.vue';
import { LIST_ITEMS_KEY } from '../../../../components/decorators/injection.consts';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { searchXModule } from '../../x-module';
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
}: RenderBannersListOptions = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(
    {
      components: {
        BannersList,
        ...components
      },
      template
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] })]
      }
    }
  );
  resetXSearchStateWith(store, { banners });

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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { wrapper, getBanners } = renderBannersList();
    const bannersListItems = wrapper.findAll(getDataTestSelector('banners-list-item'));

    getBanners().forEach(async (result, index) => {
      await nextTick();
      expect(bannersListItems.at(index)?.text()).toEqual(result.id);
    });
  });

  it('does not render any banner if the are none', () => {
    const { wrapper } = renderBannersList({ banners: [] });
    expect(wrapper.find(getDataTestSelector('banners-list')).exists()).toBe(false);
  });

  it('allows customizing the banner slot', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { wrapper, getBanners } = renderBannersList({
      template: `
        <BannersList>
          <template #banner="{ item }">
            <p data-test="banner-slot-overridden">Custom banner: {{ item.id }}</p>
          </template>
        </BannersList>`
    });

    expect(wrapper.find(getDataTestSelector('items-list')).classes('x-items-list')).toBe(true);
    expect(wrapper.find(getDataTestSelector('banners-list-item')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('banner-slot-overridden')).text()).toBe(
      `Custom banner: ${getBanners()[0].id}`
    );
  });

  it('allows customizing the default slot', () => {
    const { wrapper } = renderBannersList({
      template: `
        <BannersList>
          <template #default="{ items }">
            <p data-test="default-slot-overridden"/>
          </template>
        </BannersList>`,
      components: { BaseGrid }
    });

    expect(wrapper.find(getDataTestSelector('banners-list')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toBe(true);
  });

  it('provides the result of concatenating ancestor injected items with the banners', async () => {
    const resultsStub = getResultsStub();
    const bannersStub = getBannersStub();
    const store = new Store<DeepPartial<RootXStoreState>>({});
    resetXSearchStateWith(store, { banners: bannersStub, totalResults: resultsStub.length * 2 });

    await nextTick();

    /* It provides an array with some results */
    const Provider = defineComponent({
      name: 'Provider',
      setup() {
        const providedStub = computed((): ListItem[] => resultsStub);
        provide(LIST_ITEMS_KEY as string, providedStub);
      },
      template: `
        <div><slot /></div>
      `
    });

    /*
     * It should inject an array with the result from the Provider and the banner concatenated from
     * BannersList
     */
    const Child = defineComponent({
      name: 'Child',
      setup() {
        const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string);
        const injectedListItemsString = computed(
          (): string => injectedListItems?.value.map(item => item.id).join(',') ?? ''
        );
        return {
          injectedListItemsString
        };
      },
      template: `
        <p>{{ injectedListItemsString }}</p>
      `
    });

    const wrapper = mount(
      {
        template: '<Provider v-bind="$attrs"><BannersList><Child /></BannersList></Provider>',
        components: {
          Provider,
          Child,
          BannersList
        }
      },
      {
        store
      }
    );

    XPlugin.bus.emit('RenderedColumnsNumberChanged', 2);
    await nextTick();

    expect(wrapper.text()).toBe(
      // eslint-disable-next-line max-len
      `${bannersStub[0].id},${resultsStub[0].id},${resultsStub[1].id},${bannersStub[1].id},${bannersStub[2].id},${bannersStub[3].id},${resultsStub[2].id},${resultsStub[3].id},${bannersStub[4].id}`
    );
  });
});

interface RenderBannersListOptions {
  /** The template to be rendered. */
  template?: string;
  /** Components to be rendered. */
  components?: any;
  /** The `banners` used to be rendered. */
  banners?: Banner[];
}
