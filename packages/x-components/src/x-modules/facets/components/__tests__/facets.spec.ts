import { Facet } from '@empathy/search-types';
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

  it('renders the props facets', () => {
    const { getDefaultFacets } = renderFacetsComponent({
      facetsProp: [
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
});

function renderFacetsComponent({
  customFacetSlot = '',
  stateFacets = getFacetsDictionaryStub(),
  facetsProp,
  template = `
       <Facets :facets="facetsProp">
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
  XPlugin.resetInstance();
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(facetsXModule);
  resetXFacetsStateWith(store, { facets: stateFacets });

  const facetWrapper = mount(
    {
      components: {
        Facets
      },
      props: ['facetsProp'],
      template
    },
    {
      localVue,
      store,
      propsData: {
        facetsProp
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
  stateFacets?: Dictionary<Facet>;
  facetsProp?: Facet[];
  template?: string;
  customFacetSlot?: string;
}

interface FacetsComponentAPI {
  wrapper: Wrapper<Vue>;
  getStateFacets: () => Facet[];
  getDefaultFacets: () => WrapperArray<Vue>;
  getDefaultSelectedFilters: () => WrapperArray<Vue>;
}
