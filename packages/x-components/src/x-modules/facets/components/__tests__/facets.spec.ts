import { Facet } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial, Dictionary } from '../../../../utils/types';
import {
  createSimpleFacetStub,
  getFacetsDictionaryStub
} from '../../../../__stubs__/facets-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import Facets from '../facets.vue';
import { XPlugin } from '../../../../plugins/x-plugin';
import { facetsXModule } from '../../x-module';
import SimpleFilter from '../filters/simple-filter.vue';
import { resetXFacetsStateWith } from './utils';

describe('testing Facets component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderFacetsComponent();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has FacetsModule as XModule', () => {
    const { wrapper } = renderFacetsComponent();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
  });

  it('does not render anything when facets are empty', () => {
    const { wrapper } = renderFacetsComponent({ stateFacets: {} });
    expect(wrapper.find('facets').exists()).toBe(false);
  });

  it('renders the state facets', () => {
    const { getDefaultFacets, getStateFacets, getDefaultSelectedFilters } = renderFacetsComponent({
      stateFacets: {
        color_facet: createSimpleFacetStub('color_facet', createSimpleFilter => [
          createSimpleFilter('Red', false),
          createSimpleFilter('Blue', true)
        ]),
        brand_facet: createSimpleFacetStub('brand_facet', createSimpleFilter => [
          createSimpleFilter('Adidas', false),
          createSimpleFilter('Nike', false)
        ])
      }
    });
    const facetWrappers = getDefaultFacets();
    const stateFacets = getStateFacets();
    const facetLabels = stateFacets.map(facet => facet.label);
    const selectedFiltersWrappers = getDefaultSelectedFilters();

    expect(facetWrappers.wrappers).toHaveLength(stateFacets.length);
    facetWrappers.wrappers.forEach((facetWrapper: Wrapper<Vue>) => {
      expect(facetLabels).toContain(facetWrapper.element.innerHTML);
    });

    expect(selectedFiltersWrappers.wrappers).toHaveLength(1);
    expect(selectedFiltersWrappers.wrappers[0].text()).toEqual('Blue');
  });

  it('allows customizing a facet using a slot named with the facet.id', () => {
    const customFacetId = 'color_facet';

    const { wrapper, getDefaultFacets } = renderFacetsComponent({
      customFacetSlot: `
          <template #${customFacetId}="{ facet, selectedFilters }">
            <p data-test="custom-facet">{{ facet.label }}</p>
            <div data-test="custom-facet-selected-filters">
              <span v-for="filter in selectedFilters">{{ filter.label }}</span>
            </div>
          </template>`,
      stateFacets: {
        [customFacetId]: createSimpleFacetStub(customFacetId, createSimpleFilter => [
          createSimpleFilter('Red', true),
          createSimpleFilter('Blue', true)
        ]),
        brand_facet: createSimpleFacetStub('brand_facet', createSimpleFilter => [
          createSimpleFilter('Adidas', false),
          createSimpleFilter('Nike', false)
        ])
      }
    });
    const customFacetWrapper = wrapper.get(getDataTestSelector('custom-facet'));
    const customSelectedFiltersWrapper = wrapper.get(
      getDataTestSelector('custom-facet-selected-filters')
    );

    expect(customFacetWrapper.exists()).toBe(true);
    expect(customFacetWrapper.text()).toBe(customFacetId);
    getDefaultFacets().wrappers.forEach(facet => {
      expect(facet.text()).not.toBe(customFacetId);
    });
    expect(customSelectedFiltersWrapper.text()).toEqual('RedBlue');
  });

  it('renders the passed backendFacets keeping the filters selected state', () => {
    const { getDefaultFacets, getDefaultSelectedFilters } = renderFacetsComponent({
      backendFacets: [
        createSimpleFacetStub('color', createSimpleFilter => [
          createSimpleFilter('Red', false),
          createSimpleFilter('Blue', false)
        ]),
        createSimpleFacetStub('size', createSimpleFilter => [
          createSimpleFilter('Big', false),
          createSimpleFilter('Small', true)
        ])
      ]
    });

    const facetWrappers = getDefaultFacets();
    expect(facetWrappers).toHaveLength(2);
    facetWrappers.wrappers.forEach(facetWrapper => {
      expect(['color', 'size']).toContain(facetWrapper.text());
    });

    const selectedFiltersWrappers = getDefaultSelectedFilters();
    expect(selectedFiltersWrappers).toHaveLength(1);
    expect(selectedFiltersWrappers.wrappers[0].text()).toEqual('Small');
  });

  it('renders the passed frontendFacets keeping the filters selected state', () => {
    const { getDefaultFacets, getDefaultSelectedFilters } = renderFacetsComponent({
      stateFacets: {},
      frontendFacets: [
        createSimpleFacetStub('color', createSimpleFilter => [
          createSimpleFilter('Red', false),
          createSimpleFilter('Blue', false)
        ]),
        createSimpleFacetStub('size', createSimpleFilter => [
          createSimpleFilter('Big', false),
          createSimpleFilter('Small', true)
        ]),
        createSimpleFacetStub('age', createSimpleFilter => [
          createSimpleFilter('Junior', false),
          createSimpleFilter('Adult', false)
        ])
      ]
    });

    const facetWrappers = getDefaultFacets();
    expect(facetWrappers).toHaveLength(3);
    facetWrappers.wrappers.forEach(facetWrapper => {
      expect(['color', 'size', 'age']).toContain(facetWrapper.text());
    });

    const selectedFiltersWrappers = getDefaultSelectedFilters();
    expect(selectedFiltersWrappers).toHaveLength(1);
    expect(selectedFiltersWrappers.wrappers[0].text()).toEqual('Small');
  });

  describe('filters facets based on renderableFacets prop', () => {
    it('renders all facets when its value is omitted', () => {
      const { getDefaultFacets } = renderFacetsComponent({
        backendFacets: [
          createSimpleFacetStub('color', createSimpleFilter => [
            createSimpleFilter('Red', false),
            createSimpleFilter('Blue', false)
          ]),
          createSimpleFacetStub('size', createSimpleFilter => [
            createSimpleFilter('Big', false),
            createSimpleFilter('Small', false)
          ])
        ]
      });

      const facetWrappers = getDefaultFacets();
      expect(facetWrappers).toHaveLength(2);
      getDefaultFacets().wrappers.forEach(facetWrapper => {
        expect(['color', 'size']).toContain(facetWrapper.text());
      });
    });

    it('renders only included facets', () => {
      const { getDefaultFacets } = renderFacetsComponent({
        stateFacets: {
          color_facet: createSimpleFacetStub('color_facet', createSimpleFilter => [
            createSimpleFilter('Red', false),
            createSimpleFilter('Blue', true)
          ]),
          brand_facet: createSimpleFacetStub('brand_facet', createSimpleFilter => [
            createSimpleFilter('Adidas', false),
            createSimpleFilter('Nike', false)
          ]),
          price_facet: createSimpleFacetStub('price_facet', createSimpleFilter => [
            createSimpleFilter('< 10 €', false),
            createSimpleFilter('10 - 50 €', false)
          ])
        },
        renderableFacets: 'color_facet'
      });

      const facetWrappers = getDefaultFacets();
      expect(facetWrappers).toHaveLength(1);
      getDefaultFacets().wrappers.forEach(facetWrapper => {
        expect(['color_facet']).toContain(facetWrapper.text());
      });
    });

    it('does not render excluded facets', () => {
      const { getDefaultFacets } = renderFacetsComponent({
        backendFacets: [
          createSimpleFacetStub('color', createSimpleFilter => [
            createSimpleFilter('Red', false),
            createSimpleFilter('Blue', false)
          ]),
          createSimpleFacetStub('size', createSimpleFilter => [
            createSimpleFilter('Big', false),
            createSimpleFilter('Small', false)
          ]),
          createSimpleFacetStub('price', createSimpleFilter => [
            createSimpleFilter('< 10 €', false),
            createSimpleFilter('10 - 50 €', false)
          ])
        ],
        renderableFacets: '!color'
      });

      const facetWrappers = getDefaultFacets();
      expect(facetWrappers).toHaveLength(2);
      getDefaultFacets().wrappers.forEach(facetWrapper => {
        expect(['size', 'price']).toContain(facetWrapper.text());
      });
    });

    it('renders only included facets when combining with excluded ones', () => {
      const { getDefaultFacets } = renderFacetsComponent({
        backendFacets: [
          createSimpleFacetStub('color', createSimpleFilter => [
            createSimpleFilter('Red', false),
            createSimpleFilter('Blue', false)
          ]),
          createSimpleFacetStub('size', createSimpleFilter => [
            createSimpleFilter('Big', false),
            createSimpleFilter('Small', false)
          ]),
          createSimpleFacetStub('price', createSimpleFilter => [
            createSimpleFilter('< 10 €', false),
            createSimpleFilter('10 - 50 €', false)
          ])
        ],
        renderableFacets: 'color,!price'
      });

      const facetWrappers = getDefaultFacets();
      expect(facetWrappers).toHaveLength(1);
      getDefaultFacets().wrappers.forEach(facetWrapper => {
        expect(['color']).toContain(facetWrapper.text());
      });
    });
  });

  it('emits the `UserChangedSelectedFilters` event when a filter is changed', async () => {
    const colorFacet = createSimpleFacetStub('color', createSimpleFilter => [
      createSimpleFilter('Red', false),
      createSimpleFilter('Blue', false)
    ]);
    const sizeFacet = createSimpleFacetStub('size', createSimpleFilter => [
      createSimpleFilter('Big', true),
      createSimpleFilter('Small', false)
    ]);
    const [redFilter] = colorFacet.filters;
    const [bigFilter] = sizeFacet.filters;
    const { wrapper } = renderFacetsComponent({
      backendFacets: [],
      components: {
        SimpleFilter
      },
      customFacetSlot: `
      <template #color="{ facet }">
        <SimpleFilter v-for="filter in facet.filters"
          class="color-filter"
          :key="filter.id"
          :filter="filter"/>
      </template>
      <template #size="{ facet }">
        <SimpleFilter v-for="filter in facet.filters"
          class="size-filter"
          :key="filter.id"
          :filter="filter"/>
      </template>
`
    });

    // Setting facets with selected filters does not trigger UserChangedSelectedFilters
    await wrapper.setProps({ backendFacets: [colorFacet, sizeFacet] });
    expect(wrapper.emitted('UserChangedSelectedFilters')).toBeUndefined();

    const [redFilterWrapper] = wrapper.findAll('.color-filter').wrappers;
    const [bigFilterWrapper] = wrapper.findAll('.size-filter').wrappers;

    // Selecting a filter triggers UserChangedSelectedFilters
    await redFilterWrapper.trigger('click');
    expect(wrapper.emitted('UserChangedSelectedFilters')).toHaveLength(1);
    expect(wrapper.emitted('UserChangedSelectedFilters')![0]).toEqual([
      [{ ...redFilter, selected: true }, bigFilter]
    ]);

    // Deselecting a selected filter triggers UserChangedSelectedFilters
    await redFilterWrapper.trigger('click');
    expect(wrapper.emitted('UserChangedSelectedFilters')).toHaveLength(2);
    expect(wrapper.emitted('UserChangedSelectedFilters')![1]).toEqual([[bigFilter]]);

    // Deselecting the only selected filter triggers UserChangedSelectedFilters
    await bigFilterWrapper.trigger('click');
    expect(wrapper.emitted('UserChangedSelectedFilters')).toHaveLength(3);
    expect(wrapper.emitted('UserChangedSelectedFilters')![2]).toEqual([[]]);

    // Modifying the prop again with selected filters does not trigger UserChangedSelectedFilters
    await wrapper.setProps({ backendFacets: [colorFacet, sizeFacet] });
    expect(wrapper.emitted('UserChangedSelectedFilters')).toHaveLength(3);
  });
});

function renderFacetsComponent({
  customFacetSlot = '',
  components,
  stateFacets = getFacetsDictionaryStub(),
  backendFacets,
  frontendFacets,
  renderableFacets,
  template = `
       <Facets
        :backendFacets="backendFacets"
        :frontendFacets="frontendFacets"
        :renderableFacets="renderableFacets"
       >
          ${customFacetSlot ?? ''}
          <template #default="{ facet, selectedFilters }">
            <p data-test="default-slot-facet">{{ facet.label }}</p>
            <div v-if="selectedFilters.length > 0" data-test="default-slot-selected-filters">
              <span v-for="filter in selectedFilters">
                {{ filter.label }}
              </span>
            </div>
          </template>
       </Facets>`
}: FacetsRenderOptions = {}): FacetsComponentAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(facetsXModule);
  resetXFacetsStateWith(store, { backendFacets: stateFacets });

  const facetWrapper = mount(
    {
      components: {
        Facets,
        ...components
      },
      props: ['backendFacets', 'frontendFacets', 'renderableFacets'],
      template
    },
    {
      localVue,
      store,
      propsData: {
        backendFacets,
        frontendFacets,
        renderableFacets
      }
    }
  );
  const wrapper = facetWrapper.findComponent(Facets);

  return {
    wrapper,
    getStateFacets() {
      return Object.values(stateFacets);
    },
    getDefaultFacets() {
      return wrapper.findAll(getDataTestSelector('default-slot-facet'));
    },
    getDefaultSelectedFilters() {
      return wrapper.findAll(getDataTestSelector('default-slot-selected-filters'));
    }
  };
}

interface FacetsRenderOptions {
  components?: Dictionary<typeof Vue>;
  stateFacets?: Dictionary<Facet>;
  backendFacets?: Facet[];
  frontendFacets?: Facet[];
  renderableFacets?: string;
  template?: string;
  customFacetSlot?: string;
}

interface FacetsComponentAPI {
  wrapper: Wrapper<Vue>;
  getStateFacets: () => Facet[];
  getDefaultFacets: () => WrapperArray<Vue>;
  getDefaultSelectedFilters: () => WrapperArray<Vue>;
}
