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
import Facets from '../facets.vue';
import { resetXFacetsStateWith } from './utils';

describe('testing Facets component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  const facetsStub = getFacetsStub();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const facetTitles = facetsStub.map((facet: Facet) => facet.title);
  const facetsState = { facets: arrayToObject(facetsStub, 'title') };
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
      expect(facetTitles).toContain(facetWrapper.element.innerHTML)
    );
  });

  // eslint-disable-next-line max-len
  it('renders a custom composition for a specific Facet by overriding a slot and the rest use the default slot composition', () => {
    const facetToCustomize: string = facetTitles[0];
    const customSlotTemplate = `
       <template #${facetToCustomize}="{ facet }">
          <p class="facet" data-test="hierarchical_category-slot-facet">{{ facet.title }}</p>
       </template>`;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getDefaultedFacets, getCustomizedFacet } = renderFacetsComponent(
      mountOptions,
      customSlotTemplate
    );
    const customizedFacetWrapper = getCustomizedFacet(facetToCustomize);

    expect(customizedFacetWrapper.exists()).toBe(true);
    expect(customizedFacetWrapper.element.innerHTML).toBe(facetToCustomize);

    getDefaultedFacets().wrappers.forEach(facet =>
      expect(facet.element.innerHTML).not.toBe(facetToCustomize)
    );
  });
});

function renderFacetsComponent(
  mountOptions: {
    localVue: VueConstructor;
    store: Store<DeepPartial<RootXStoreState>>;
  },
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
            <p class="facet" data-test="default-slot-facet">{{ facet.title }}</p>
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
    },
    getCustomizedFacet(customizedFacetTitle: string) {
      return component.find(getDataTestSelector(`${customizedFacetTitle}-slot-facet`));
    }
  };
}

interface FacetsComponentAPI {
  component: Wrapper<Vue>;
  getAllFacets(): WrapperArray<Vue>;
  getDefaultedFacets(): WrapperArray<Vue>;
  getCustomizedFacet(customizedFacetTitle: string): Wrapper<Vue>;
}
