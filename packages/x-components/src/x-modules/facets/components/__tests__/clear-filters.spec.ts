import { Facet } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import {
  createHierarchicalFacetStub,
  createSimpleFacetStub
} from '../../../../__stubs__/facets-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { FilterEntityFactory } from '../../entities/filter-entity.factory';
import { DefaultFacetsService } from '../../service/facets.service';
import { facetsXModule } from '../../x-module';
import ClearFilters from '../clear-filters.vue';
import { resetXFacetsStateWith } from './utils';

/**
 * Renders the `ClearFilters` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `ClearFilters` component.
 */
function renderClearFilters({
  template = `
    <ClearFilters v-slot="{ selectedFilters }" :facets-ids="facetsIds">
      Clear {{ selectedFilters.length }} filters
    </ClearFilters>
  `
}: RenderFiltersOptions = {}): RenderFiltersAPI {
  DefaultFacetsService.instance = new DefaultFacetsService(new FilterEntityFactory());

  const facets = {
    category: createHierarchicalFacetStub('Category', createFilter => [
      ...createFilter('Men', false),
      ...createFilter('Women', false)
    ]),
    brand: createSimpleFacetStub('Brand', createFilter => [
      createFilter('Audi', false),
      createFilter('BMW', false)
    ])
  };

  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store: Store<DeepPartial<RootXStoreState>> = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(facetsXModule);

  resetXFacetsStateWith(store, facets);
  const wrapper = mount(
    {
      components: {
        ClearFilters
      },
      template,
      props: ['facetsIds']
    },
    {
      localVue,
      store
    }
  );

  const clearFiltersWrapper = wrapper.findComponent(ClearFilters);

  return {
    wrapper,
    clearFiltersWrapper,
    setCategoryFacetFiltersAsSelected() {
      facets.category.filters.forEach(filter => DefaultFacetsService.instance.select(filter));
      return localVue.nextTick();
    },
    setFacetsIds(facetsIds) {
      wrapper.setProps({ facetsIds });
      return localVue.nextTick();
    }
  };
}

describe('testing ClearFilters component', () => {
  it('is an x-component', () => {
    const { clearFiltersWrapper } = renderClearFilters();

    expect(isXComponent(clearFiltersWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { clearFiltersWrapper } = renderClearFilters();

    expect(getXComponentXModuleName(clearFiltersWrapper.vm)).toEqual('facets');
  });

  it('does not render if there are no selected filters', async () => {
    const { wrapper, setCategoryFacetFiltersAsSelected } = renderClearFilters();

    expect(wrapper.find(getDataTestSelector('clear-filters')).exists()).toBe(false);

    await setCategoryFacetFiltersAsSelected();

    expect(wrapper.find(getDataTestSelector('clear-filters')).exists()).toBe(true);
    expect(wrapper.attributes()).not.toHaveProperty('disabled');
    expect(wrapper.text()).toEqual('Clear 2 filters');
  });

  it('does not render if there are selected filters with the provided facetIds', async () => {
    const { wrapper, setCategoryFacetFiltersAsSelected, setFacetsIds } = renderClearFilters();

    await setCategoryFacetFiltersAsSelected();
    await setFacetsIds(['brand']);

    expect(wrapper.find(getDataTestSelector('clear-filters')).exists()).toBe(false);

    await setFacetsIds(['category']);
    expect(wrapper.find(getDataTestSelector('clear-filters')).exists()).toBe(true);
    expect(wrapper.attributes()).not.toHaveProperty('disabled');
    expect(wrapper.text()).toEqual('Clear 2 filters');
  });

  it(
    'is disabled if there are selected filters with the provided facetIds when ' +
      'the alwaysVisible prop is true',
    async () => {
      const { wrapper, setCategoryFacetFiltersAsSelected, setFacetsIds } = renderClearFilters({
        template: `
          <ClearFilters v-slot="{ selectedFilters }" :alwaysVisible="true" :facets-ids="facetsIds">
            Clear {{ selectedFilters.length }} filters
          </ClearFilters>`
      });

      expect(wrapper.find(getDataTestSelector('clear-filters')).exists()).toBe(true);
      expect(wrapper.attributes()).toHaveProperty('disabled');
      expect(wrapper.text()).toEqual('Clear 0 filters');

      await setCategoryFacetFiltersAsSelected();

      expect(wrapper.attributes()).not.toHaveProperty('disabled');
      expect(wrapper.text()).toEqual('Clear 2 filters');

      await setFacetsIds(['brand']);

      expect(wrapper.attributes()).toHaveProperty('disabled');
      expect(wrapper.text()).toEqual('Clear 0 filters');

      await setFacetsIds(['category']);
      expect(wrapper.attributes()).not.toHaveProperty('disabled');
      expect(wrapper.text()).toEqual('Clear 2 filters');
    }
  );

  it('emits UserClickedClearAllFilters event with the provided facetIds', async () => {
    const listenerClearFilterFacets = jest.fn();
    const facetsIds = ['category'];
    const { wrapper, setCategoryFacetFiltersAsSelected, setFacetsIds } = renderClearFilters();
    wrapper.vm.$x.on('UserClickedClearAllFilters', true).subscribe(listenerClearFilterFacets);

    await setCategoryFacetFiltersAsSelected();
    await setFacetsIds(facetsIds);
    wrapper.trigger('click');

    expect(wrapper.find(getDataTestSelector('clear-filters')).exists()).toBe(true);
    expect(listenerClearFilterFacets).toHaveBeenCalledTimes(1);
    expect(listenerClearFilterFacets).toHaveBeenCalledWith({
      eventPayload: facetsIds,
      metadata: {
        moduleName: 'facets',
        target: wrapper.element
      }
    });
  });

  it('emits UserClickedClearAllFilters event', async () => {
    const listenerClearFilter = jest.fn();
    const { wrapper, setCategoryFacetFiltersAsSelected } = renderClearFilters();
    wrapper.vm.$x.on('UserClickedClearAllFilters', true).subscribe(listenerClearFilter);

    await setCategoryFacetFiltersAsSelected();
    wrapper.trigger('click');

    expect(wrapper.find(getDataTestSelector('clear-filters')).exists()).toBe(true);
    expect(listenerClearFilter).toHaveBeenCalledTimes(1);
    expect(listenerClearFilter).toHaveBeenCalledWith({
      eventPayload: undefined,
      metadata: {
        moduleName: 'facets',
        target: wrapper.element
      }
    });
  });
});

interface RenderFiltersOptions {
  /** The template to be rendered. */
  template?: string;
}

interface RenderFiltersAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** The `clearFilters` wrapper component. */
  clearFiltersWrapper: Wrapper<Vue>;
  /**
   * Change value property "selected" of some specifics filters.
   *
   * @returns A promise that resolves after re-rendering the component.
   */
  setCategoryFacetFiltersAsSelected: () => Promise<void>;
  /**
   * Set the new facets ids for setting the property "facetsIds".
   *
   * @returns A promise that resolves after re-rendering the component.
   */
  setFacetsIds: (facetsIds: Array<Facet['id']>) => Promise<void>;
}
