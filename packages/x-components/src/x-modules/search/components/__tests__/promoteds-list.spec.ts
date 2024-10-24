import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { defineComponent, computed, provide, inject, Ref, nextTick } from 'vue';
import { Store } from 'vuex';
import BaseGrid from '../../../../components/base-grid.vue';
import { LIST_ITEMS_KEY, getXComponentXModuleName, isXComponent } from '../../../../components';
import { RootXStoreState } from '../../../../store';
import { ListItem } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import PromotedsList from '../promoteds-list.vue';
import { getPromotedsStub, getResultsStub } from '../../../../__stubs__';
import { searchXModule } from '../../x-module';
import { resetXSearchStateWith } from './utils';

async function render({
  template = '<PromotedsList />',
  promoteds = getPromotedsStub(),
  components = {}
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(
    {
      components: { PromotedsList, ...components },
      template
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] })]
      }
    }
  );
  resetXSearchStateWith(store, { promoteds });
  await nextTick();

  return {
    wrapper: wrapper.findComponent(PromotedsList),
    promoteds
  };
}

describe('testing PromotedsList component', () => {
  it('is an XComponent which has an XModule', async () => {
    const { wrapper } = await render();

    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('search');
  });

  it('renders the promoteds in the state', async () => {
    const { wrapper, promoteds } = await render();
    const promotedsListItems = wrapper.findAll(getDataTestSelector('promoteds-list-item'));

    promoteds.forEach((result, index) =>
      expect(promotedsListItems.at(index)?.text()).toEqual(result.id)
    );
  });

  it('does not render any promoted if the are none', async () => {
    const { wrapper } = await render({ promoteds: [] });

    expect(wrapper.find(getDataTestSelector('promoteds-list')).exists()).toEqual(false);
  });

  it('allows customizing the promoted slot', async () => {
    const { wrapper, promoteds } = await render({
      template: `
        <PromotedsList>
          <template #promoted="{ item }">
            <p data-test="promoted-slot-overridden">Custom promoted: {{ item.title }}</p>
          </template>
        </PromotedsList>`
    });

    expect(wrapper.find(getDataTestSelector('items-list')).classes('x-items-list')).toEqual(true);
    expect(wrapper.find(getDataTestSelector('promoteds-list-item')).exists()).toEqual(true);
    expect(wrapper.find(getDataTestSelector('promoted-slot-overridden')).text()).toEqual(
      `Custom promoted: ${promoteds[0].title}`
    );
  });

  it('allows customizing the default slot', async () => {
    const { wrapper } = await render({
      template: `
        <PromotedsList>
          <template #default="{ promoteds }">
            <p data-test="default-slot-overridden"/>
          </template>
        </PromotedsList>`,
      components: { BaseGrid }
    });

    expect(wrapper.find(getDataTestSelector('promoteds-list')).exists()).toEqual(false);
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toEqual(true);
  });

  it('provides the result of concatenating ancestor injected items with the promoteds', async () => {
    const resultsStub = getResultsStub();
    const promotedsStub = getPromotedsStub();

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
     * PromotedList
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
        template: '<Provider><PromotedsList><Child /></PromotedsList></Provider>',
        components: { Provider, Child, PromotedsList }
      },
      {
        global: {
          plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] })]
        }
      }
    );

    resetXSearchStateWith(store, {
      promoteds: promotedsStub,
      totalResults: resultsStub.length * 2
    });
    await nextTick();

    expect(wrapper.text()).toEqual(
      `${promotedsStub[0].id},${resultsStub[0].id},${promotedsStub[1].id},${promotedsStub[2].id},
      ${promotedsStub[3].id},${resultsStub[1].id},${resultsStub[2].id},${resultsStub[3].id},
      ${promotedsStub[4].id}`.replace(/\s/g, '')
    );
  });
});
