import { Facet, Filter } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
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
import { areFiltersDifferent } from '../../../../../utils/filters';
import { resetFacetsService } from '../../../__tests__/utils';
import { getStoreFilter } from '../../../entities/__tests__/utils';
import { DefaultFacetsService } from '../../../service/facets.service';
import { facetsXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
import FacetsProvider from '../facets-provider.vue';

describe('testing Facets component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('is an XComponent', () => {
    const { wrapper } = renderFacetsProviderComponent();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has FacetsModule as XModule', () => {
    const { wrapper } = renderFacetsProviderComponent();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
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
    let emittedEvents = wrapper.emitted('UserChangedSelectedFilters');
    expect(emittedEvents).toHaveLength(1);
    let emittedFilters: Filter[] = emittedEvents?.[0][0];
    expect(areFiltersDifferent(emittedFilters, [redFilter, bigFilter, smallFilter])).toBe(false);

    // Modifying the prop again with selected filters does not trigger UserChangedSelectedFilters
    await wrapper.setProps({ facets: [colorFacet, sizeFacet] });
    expect(wrapper.emitted('UserChangedSelectedFilters')).toHaveLength(1);

    await selectFilters([smallFilter]);
    expect(wrapper.emitted('UserChangedSelectedFilters')).toHaveLength(1);

    await deselectFilters([smallFilter]);
    emittedEvents = wrapper.emitted('UserChangedSelectedFilters');
    expect(emittedEvents).toHaveLength(2);
    emittedFilters = emittedEvents?.[1][0];
    expect(areFiltersDifferent(emittedFilters, [])).toBe(false);
  });
});

function renderFacetsProviderComponent({
  stateFacets = {},
  providedFacets = []
}: FacetsRenderOptions = {}): FacetsComponentAPI {
  resetFacetsService();

  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<RootXStoreState>({});
  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(facetsXModule);
  resetXFacetsStateWith(store, stateFacets);

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
      return store.getters['x/facets/facets'];
    },
    async selectFilters(filters: Filter[]): Promise<void> {
      filters.forEach(filter => {
        // The provided filters should not be mutated. That's why we search for them in the state.
        DefaultFacetsService.instance.select(getStoreFilter(store, filter.id));
      });
      await localVue.nextTick();
      jest.runAllTimers();
    },
    async deselectFilters(filters: Filter[]): Promise<void> {
      filters.forEach(filter =>
        // The provided filters should not be mutated. That's why we search for them in the state.
        DefaultFacetsService.instance.deselect(getStoreFilter(store, filter.id))
      );
      await localVue.nextTick();
      jest.runAllTimers();
    }
  };
}

interface FacetsRenderOptions {
  /**
   * Facets to pass as prop to the {@link FacetsProvider} component.
   */
  providedFacets?: Facet[];
  /**
   * Facets to initialise the store state with. They belong to a different group than the provided
   * ones.
   */
  stateFacets?: Dictionary<Facet>;
}

interface FacetsComponentAPI {
  /**
   * Deselects the given filters in the store. The provided filters should not be mutated. That's
   * why we search for them in the state.
   *
   * @param filters - The list of filters to deselect.
   *
   * @returns A promise that resolves after updating the view.
   */
  deselectFilters: (filters: Filter[]) => Promise<void>;
  /**
   * Retrieves all the stored facets.
   */
  getStateFacets: () => Record<Facet['id'], Facet>;
  /**
   * Selects the given filters. The provided filters should not be mutated. That's
   * why we search for them in the state.
   *
   * @param filters - The list of filters to select.
   * @returns A promise that resolves after updating the view.
   */
  selectFilters: (filters: Filter[]) => Promise<void>;
  /**
   * The testing wrapper of the {@link FacetsProvider} component.
   */
  wrapper: Wrapper<Vue>;
}
