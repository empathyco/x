import { Promoted } from '@empathyco/x-types-old';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor, ComponentOptions } from 'vue';
import Vuex, { Store } from 'vuex';
import Component from 'vue-class-component';
import BaseGrid from '../../../../components/base-grid.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial, Dictionary, SearchItem } from '../../../../utils/types';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import PromotedsList from '../promoteds-list.vue';
import { getPromotedsStub } from '../../../../__stubs__/promoteds-stubs.factory';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { XInject, XProvide } from '../../../../components/decorators/injection.decorators';
import { SEARCH_ITEMS_KEY } from '../../../../components/decorators/injection.consts';
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
          <template #promoted="{ searchItem }">
            <p data-test="promoted-slot-overridden">Custom promoted: {{ searchItem.title }}</p>
          </template>
        </PromotedsList>`
    });

    expect(wrapper.classes('x-search-items-list')).toBe(true);
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
    const resultStub = getResultsStub().slice(0, 1);
    const promotedStub = getPromotedsStub().slice(0, 1);
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);
    resetXSearchStateWith(store, { promoteds: promotedStub });

    /* It provides an array with one result */
    @Component({
      template: `<div><slot/></div>`
    })
    class Provider extends Vue {
      @XProvide(SEARCH_ITEMS_KEY)
      public providedStub: SearchItem[] = resultStub;
    }

    /*
     * It should inject an array with the result from the Provider and the banner concatenated from
     * BannersList
     */
    @Component({
      template: `
        <p>{{ injectedItemsString }}</p>
      `
    })
    class Child extends Vue {
      @XInject(SEARCH_ITEMS_KEY)
      public injectedItems: SearchItem[] | undefined;

      protected get injectedItemsString(): string {
        return this.injectedItems?.map(item => item.id).join(',') ?? '';
      }
    }

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

    expect(wrapper.text()).toBe(`${promotedStub[0].id},${resultStub[0].id}`);
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
