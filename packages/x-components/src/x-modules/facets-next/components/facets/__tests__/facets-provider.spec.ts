import { Facet, Filter } from '@empathyco/x-types-next';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createSimpleFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
import { installNewXPlugin } from '../../../../../__tests__/utils';
import {
  getXComponentXModuleName,
  isXComponent
} from '../../../../../components/x-component.utils';
import { XPlugin } from '../../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../../store/store.types';
import { arrayToObject } from '../../../../../utils/array';
import { DeepPartial, Dictionary } from '../../../../../utils/types';
import { DefaultFacetsService } from '../../../service/facets.service';
import { facetsNextXModule as facetsXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
import FacetsProvider from '../facets-provider.vue';

describe('testing Facets component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderFacetsProviderComponent();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has FacetsModule as XModule', () => {
    const { wrapper } = renderFacetsProviderComponent();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facetsNext');
  });

  it('keeps the state facets if no facets are provided', () => {
    const stateFacets = {
      color_facet: createSimpleFacetStub('color', createSimpleFilter => [
        createSimpleFilter('Red', false),
        createSimpleFilter('Blue', true)
      ]),
      brand_facet: createSimpleFacetStub('brand', createSimpleFilter => [
        createSimpleFilter('Adidas', false),
        createSimpleFilter('Nike', false)
      ])
    };
    const { getStateFacets } = renderFacetsProviderComponent({
      stateFacets,
      providedFacets: undefined
    });
    expect(getStateFacets()).toEqual(stateFacets);
  });

  it('renders the provided facets keeping the state facets', () => {
    const stateFacets = {
      color_facet: createSimpleFacetStub('color', createSimpleFilter => [
        createSimpleFilter('Red', false),
        createSimpleFilter('Blue', true)
      ]),
      brand_facet: createSimpleFacetStub('brand', createSimpleFilter => [
        createSimpleFilter('Adidas', false),
        createSimpleFilter('Nike', false)
      ])
    };
    const providedFacets: Facet[] = [
      createSimpleFacetStub('size', createSimpleFilter => [
        createSimpleFilter('Small', false),
        createSimpleFilter('Large', true)
      ]),
      createSimpleFacetStub('stock', createSimpleFilter => [
        createSimpleFilter('no stock', false),
        createSimpleFilter('with stock', false)
      ])
    ];
    const { getStateFacets } = renderFacetsProviderComponent({
      stateFacets,
      providedFacets
    });

    expect(getStateFacets()).toEqual(
      Object.assign(stateFacets, arrayToObject(providedFacets, 'id'))
    );
  });

  it('emits the `UserChangedSelectedFilters` event when a filter is changed', async () => {
    const { wrapper, deselectFilters, selectFilters } = renderFacetsProviderComponent();

    const colorFacet = createSimpleFacetStub('color', createSimpleFilter => [
      createSimpleFilter('Red', false),
      createSimpleFilter('Blue', false)
    ]);
    const sizeFacet = createSimpleFacetStub('size', createSimpleFilter => [
      createSimpleFilter('Big', false),
      createSimpleFilter('Small', true)
    ]);
    const [redFilter] = colorFacet.filters;
    const [bigFilter, smallFilter] = sizeFacet.filters;

    // Setting facets with selected filters does not trigger UserChangedSelectedFilters
    await wrapper.setProps({ facets: [colorFacet, sizeFacet] });
    expect(wrapper.emitted('UserChangedSelectedFilters')).toBeUndefined();

    // Selecting a filter triggers UserChangedSelectedFilters
    await selectFilters([redFilter, bigFilter]);
    expect(wrapper.emitted('UserChangedSelectedNextFilters')).toHaveLength(1);

    // Modifying the prop again with selected filters does not trigger UserChangedSelectedFilters
    await wrapper.setProps({ facets: [colorFacet, sizeFacet] });
    expect(wrapper.emitted('UserChangedSelectedNextFilters')).toHaveLength(1);

    await selectFilters([smallFilter]);
    expect(wrapper.emitted('UserChangedSelectedNextFilters')).toHaveLength(1);

    await deselectFilters([smallFilter]);
    expect(wrapper.emitted('UserChangedSelectedNextFilters')).toHaveLength(2);
  });
});

function renderFacetsProviderComponent({
  stateFacets = {},
  providedFacets
}: FacetsRenderOptions = {}): FacetsComponentAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(facetsXModule);
  const filters = arrayToObject(
    Object.values(stateFacets)
      ?.map(facet => facet.filters)
      .flat(),
    'id'
  );
  resetXFacetsStateWith(store, { facets: stateFacets, filters });

  const facetWrapper = mount(
    {
      template: '<FacetsProvider :facets="providedFacets" />',
      components: {
        FacetsProvider
      },
      props: ['providedFacets']
    },
    {
      localVue,
      store,
      propsData: {
        providedFacets
      }
    }
  );
  const wrapper = facetWrapper.findComponent(FacetsProvider);

  return {
    wrapper,
    getStateFacets(): Record<Facet['id'], Facet> {
      return store.getters['x/facetsNext/facets'];
    },
    async selectFilters(filters: Filter[]): Promise<void> {
      filters.forEach(filter => DefaultFacetsService.instance.select(filter));
      await Vue.nextTick();
    },
    async deselectFilters(filters: Filter[]): Promise<void> {
      filters.forEach(filter => DefaultFacetsService.instance.deselect(filter));
      await Vue.nextTick();
    }
  };
}

interface FacetsRenderOptions {
  stateFacets?: Dictionary<Facet>;
  providedFacets?: Facet[];
}

interface FacetsComponentAPI {
  wrapper: Wrapper<Vue>;
  getStateFacets: () => Record<Facet['id'], Facet>;
  selectFilters: (filters: Filter[]) => Promise<void>;
  deselectFilters: (filters: Filter[]) => Promise<void>;
}
