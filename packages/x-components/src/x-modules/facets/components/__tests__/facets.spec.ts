import { Facet } from '@empathy/search-types';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue, { ComponentOptions, VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { arrayToObject } from '../../../../utils/array';
import { DeepPartial } from '../../../../utils/types';
import { getFacetsStub } from '../../../../__stubs__/facets-stubs.factory';
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
  resetXFacetsStateWith(store, facetsState);

  const mountOptions = {
    localVue,
    store
  };

  const component = mount(Facets, mountOptions);

  it('is an XComponent', () => {
    expect(isXComponent(component.vm)).toEqual(true);
  });

  it('has FacetsModule as XModule', () => {
    expect(getXComponentXModuleName(component.vm)).toEqual('facets');
  });

  it('does not render anything when facets are empty', () => {
    expect(component.find('facets').exists()).toBe(false);
  });

  it('renders a dictionary of Facets as specified in the override default slot', () => {
    const facetWrappers = renderFacetsComponent(mountOptions).getAllFacets();

    expect(facetWrappers).toHaveLength(facetsStub.length);
    facetWrappers.wrappers.forEach((facetWrapper: Wrapper<Vue>) =>
      expect(facetLabels).toContain(facetWrapper.element.innerHTML)
    );
  });

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
          <template #default="{ facet }">
            <p class="facet" data-test="default-slot-facet">{{ facet.label }}</p>
          </template>
       </Facets>`
  };

  const component = mount(facetsWrapper, mountOptions);

  return {
    component,
    getAllFacets() {
      return component.findAll('.facet');
    },
    getDefaultedFacets() {
      return component.findAll(getDataTestSelector('default-slot-facet'));
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
  getDefaultedFacets: () => WrapperArray<Vue>;
}
