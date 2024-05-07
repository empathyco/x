import { Promoted } from '@empathyco/x-types';
import { DeepPartial, Dictionary } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, {
  VueConstructor,
  ComponentOptions,
  defineComponent,
  computed,
  provide,
  inject,
  Ref
} from 'vue';
import Vuex, { Store } from 'vuex';
import BaseGrid from '../../../../components/base-grid.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { ListItem } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import PromotedsList from '../promoteds-list.vue';
import { getPromotedsStub } from '../../../../__stubs__/promoteds-stubs.factory';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { LIST_ITEMS_KEY } from '../../../../components/decorators/injection.consts';
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
      expect(promotedsListItems.at(index).text()).toEqual(result.id);
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
          <template #promoted="{ item }">
            <p data-test="promoted-slot-overridden">Custom promoted: {{ item.title }}</p>
          </template>
        </PromotedsList>`
    });

    expect(wrapper.find(getDataTestSelector('items-list')).classes('x-items-list')).toBe(true);
    expect(wrapper.find(getDataTestSelector('promoteds-list-item')).exists()).toBe(true);
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

  it('provides the result of concatenating ancestor injected items with the promoteds', () => {
    const resultsStub = getResultsStub();
    const promotedsStub = getPromotedsStub();
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);
    resetXSearchStateWith(store, {
      promoteds: promotedsStub,
      totalResults: resultsStub.length * 2
    });

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
        const injectedListItems = inject<Ref<ListItem[] | undefined>>(LIST_ITEMS_KEY as string);
        const injectedListItemsString = computed(
          (): string => injectedListItems?.value!.map(item => item.id).join(',') ?? ''
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
        template: '<Provider v-bind="$attrs"><PromotedsList><Child /></PromotedsList></Provider>',
        components: {
          Provider,
          Child,
          PromotedsList
        }
      },
      {
        localVue,
        store
      }
    );

    expect(wrapper.text()).toBe(
      // eslint-disable-next-line max-len
      `${promotedsStub[0].id},${resultsStub[0].id},${promotedsStub[1].id},${promotedsStub[2].id},${promotedsStub[3].id},${resultsStub[1].id},${resultsStub[2].id},${resultsStub[3].id},${promotedsStub[4].id}`
    );
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
