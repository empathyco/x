import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { computed, defineComponent, provide, inject, Ref, nextTick } from 'vue';
import { Store } from 'vuex';
import BaseGrid from '../../../../components/base-grid.vue';
import { LIST_ITEMS_KEY, getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { RootXStoreState } from '../../../../store';
import { ListItem } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getBannersStub, getResultsStub } from '../../../../__stubs__';
import BannersList from '../banners-list.vue';
import { searchXModule } from '../../x-module';
import { resetXSearchStateWith } from './utils';

async function render({
  template = '<BannersList />',
  banners = getBannersStub(),
  components = {}
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(
    {
      components: { BannersList, ...components },
      template
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] })]
      }
    }
  );
  resetXSearchStateWith(store, { banners });
  await nextTick();

  const bannersListWrapper = wrapper.findComponent(BannersList);

  return {
    wrapper: bannersListWrapper,
    banners
  };
}

describe('testing BannersList component', () => {
  it('is an XComponent which has an XModule', async () => {
    const { wrapper } = await render();

    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('search');
  });

  it('renders the banners in the state', async () => {
    const { wrapper, banners } = await render();
    const bannersListItems = wrapper.findAll(getDataTestSelector('banners-list-item'));

    banners.forEach((result, index) =>
      expect(bannersListItems.at(index)?.text()).toEqual(result.id)
    );
  });

  it('does not render any banner if the are none', async () => {
    const { wrapper } = await render({ banners: [] });

    expect(wrapper.isVisible()).toEqual(false);
  });

  it('allows customizing the banner slot', async () => {
    const { wrapper, banners } = await render({
      template: `
        <BannersList>
          <template #banner="{ item }">
            <p data-test="banner-slot-overridden">Custom banner: {{ item.id }}</p>
          </template>
        </BannersList>`
    });

    expect(wrapper.find(getDataTestSelector('items-list')).classes('x-items-list')).toEqual(true);
    expect(wrapper.find(getDataTestSelector('banners-list-item')).exists()).toEqual(true);
    expect(wrapper.find(getDataTestSelector('banner-slot-overridden')).text()).toEqual(
      `Custom banner: ${banners[0].id}`
    );
  });

  it('allows customizing the default slot', async () => {
    const { wrapper } = await render({
      template: `
        <BannersList>
          <template #default="{ items }">
            <p data-test="default-slot-overridden"/>
          </template>
        </BannersList>`,
      components: { BaseGrid }
    });

    expect(wrapper.find(getDataTestSelector('banners-list')).exists()).toEqual(false);
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toEqual(true);
  });

  it('provides the result of concatenating ancestor injected items with the banners', async () => {
    const resultsStub = getResultsStub();
    const bannersStub = getBannersStub();

    /* It provides an array with some results */
    const Provider = defineComponent({
      name: 'Provider',
      setup() {
        const providedStub = computed((): ListItem[] => resultsStub);
        provide(LIST_ITEMS_KEY as string, providedStub);
      },
      template: `<div><slot /></div>`
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
          () => injectedListItems?.value.map(item => item.id).join(',') ?? ''
        );
        return { injectedListItemsString };
      },
      template: `<p>{{ injectedListItemsString }}</p>`
    });

    const store = new Store<DeepPartial<RootXStoreState>>({});
    const wrapper = mount(
      {
        template: '<Provider><BannersList><Child /></BannersList></Provider>',
        components: { Provider, Child, BannersList }
      },
      {
        global: {
          plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] })]
        }
      }
    );

    resetXSearchStateWith(store, { banners: bannersStub, totalResults: resultsStub.length * 2 });
    await nextTick();

    await XPlugin.bus.emit('RenderedColumnsNumberChanged', 2);
    await nextTick();

    expect(wrapper.text()).toEqual(
      `${bannersStub[0].id},${resultsStub[0].id},${resultsStub[1].id},${bannersStub[1].id},
      ${bannersStub[2].id},${bannersStub[3].id},${resultsStub[2].id},${resultsStub[3].id},
      ${bannersStub[4].id}`.replace(/\s/g, '')
    );
  });
});
