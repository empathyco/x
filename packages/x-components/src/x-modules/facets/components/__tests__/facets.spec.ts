import { Facet } from '@empathy/search-types';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue, { ComponentOptions, VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { arrayToObject } from '../../../../utils/array';
import { DeepPartial } from '../../../../utils/types';
import { createSimpleFacetStub, getFacetsStub } from '../../../../__stubs__/facets-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { FacetsState } from '../../store/types';
import Facets from '../facets.vue';
import { resetXFacetsStateWith } from './utils';

describe('testing Facets component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  const facetsStub = getFacetsStub();
  const facetLabels = facetsStub.map((facet: Facet) => facet.label);
  const facetsState: Partial<FacetsState> = { facets: arrayToObject(facetsStub, 'id') };

  const mountOptions = {
    localVue,
    store
  };

  const component = mount(Facets, mountOptions);

  beforeEach(() => {
    resetXFacetsStateWith(store, facetsState);
  });

  it('is an XComponent', () => {
    expect(isXComponent(component.vm)).toEqual(true);
  });

  it('has FacetsModule as XModule', () => {
    expect(getXComponentXModuleName(component.vm)).toEqual('facets');
  });

  it('does not render anything when facets are empty', () => {
    expect(component.find('facets').exists()).toBe(false);
  });

  describe('default slot', () => {
    it('renders a dictionary of Facets as specified in the override default slot', () => {
      const facetWrappers = renderFacetsComponent(mountOptions).getAllFacets();

      expect(facetWrappers).toHaveLength(facetsStub.length);
      facetWrappers.wrappers.forEach((facetWrapper: Wrapper<Vue>) =>
        expect(facetLabels).toContain(facetWrapper.element.innerHTML)
      );
    });

    // eslint-disable-next-line max-len
    it('renders the selected filters for each facet as specified in the override default slot', () => {
      resetXFacetsStateWith(store, {
        facets: {
          color_facet: createSimpleFacetStub('color_facet', createSimpleFilter => [
            createSimpleFilter('Red', false),
            createSimpleFilter('Blue', true)
          ]),
          brand_facet: createSimpleFacetStub('brand_facet', createSimpleFilter => [
            createSimpleFilter('Adidas', true),
            createSimpleFilter('Nike', false)
          ])
        }
      });
      const defaultedSelectedFilters = renderFacetsComponent(
        mountOptions
      ).getDefaultedSelectedFilters();

      expect(defaultedSelectedFilters).toHaveLength(2);
    });
  });

  describe('specific facet slot', () => {
    it('allows customizing a specific facet using the slot given by the facet.id', () => {
      const facetToCustomize = facetsStub[0];
      const customSlotTemplate = `
       <template #${facetToCustomize.id}="{ facet }">
          <p class="facet" data-test="customized-facet">{{ facet.label }}</p>
       </template>`;

      const { component, getDefaultedFacets } = renderFacetsComponent(
        mountOptions,
        customSlotTemplate
      );
      const customizedFacetWrapper = component.find(getDataTestSelector('customized-facet'));

      expect(customizedFacetWrapper.exists()).toBe(true);
      expect(customizedFacetWrapper.text()).toBe(facetToCustomize.label);

      getDefaultedFacets().wrappers.forEach(facet => {
        expect(facet.text()).not.toBe(facetToCustomize.label);
      });
    });

    it('renders the selected filters in the customized facet slot', () => {
      const facetId = 'color_facet';
      resetXFacetsStateWith(store, {
        facets: {
          color_facet: createSimpleFacetStub(facetId, createSimpleFilter => [
            createSimpleFilter('Red', false),
            createSimpleFilter('Blue', true)
          ])
        }
      });
      const customSlotTemplate = `
       <template #${facetId}="{ selectedFilters }">
          <span v-if="selectedFilters.length > 0" data-test="customized-facet-selected-filters">
            {{ selectedFilters.length + ' selected' }}
          </span>
       </template>`;

      const customizedFacetSelectedFilters = renderFacetsComponent(
        mountOptions,
        customSlotTemplate
      ).getCustomizedSelectedFilters();

      expect(customizedFacetSelectedFilters).toHaveLength(1);
    });
  });
});

function renderFacetsComponent(
  mountOptions: FacetsMountOptions,
  customizedSlotTemplate?: string
): FacetsComponentAPI {
  const facetsWrapper: ComponentOptions<Vue> = {
    components: {
      Facets
    },
    template: `
       <Facets>
          ${customizedSlotTemplate ?? ''}
          <template #default="{ facet, selectedFilters }">
            <p class="facet" data-test="default-slot-facet">{{ facet.label }}</p>
            <span v-if="selectedFilters.length > 0" data-test="default-slot-selected-filters">
              {{ selectedFilters.length + ' selected' }}
            </span>
          </template>
       </Facets>`
  };

  const component = mount(facetsWrapper, mountOptions);

  return {
    component,
    getAllFacets() {
      return component.findAll('.facet');
    },
    getCustomizedSelectedFilters() {
      return component.findAll(getDataTestSelector('customized-facet-selected-filters'));
    },
    getDefaultedFacets() {
      return component.findAll(getDataTestSelector('default-slot-facet'));
    },
    getDefaultedSelectedFilters() {
      return component.findAll(getDataTestSelector('default-slot-selected-filters'));
    }
  };
}

interface FacetsMountOptions {
  localVue: VueConstructor;
  store: Store<DeepPartial<RootXStoreState>>;
}

interface FacetsComponentAPI {
  component: Wrapper<Vue>;
  getAllFacets: () => WrapperArray<Vue>;
  getCustomizedSelectedFilters: () => WrapperArray<Vue>;
  getDefaultedFacets: () => WrapperArray<Vue>;
  getDefaultedSelectedFilters: () => WrapperArray<Vue>;
}
