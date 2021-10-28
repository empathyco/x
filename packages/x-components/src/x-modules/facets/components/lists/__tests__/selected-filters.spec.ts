import { Facet } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createSimpleFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
import { installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XPlugin } from '../../../../../plugins';
import { RootXStoreState } from '../../../../../store';
import { DeepPartial } from '../../../../../utils';
import { FilterEntityFactory } from '../../../entities/filter-entity.factory';
import { DefaultFacetsService } from '../../../service/facets.service';
import { facetsXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
import SelectedFilters from '../selected-filters.vue';

/**
 * Renders the `SelectedFilters` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `SelectedFilters` component.
 */
function renderSelectedFilters({
  template = '<SelectedFilters />'
}: RenderSelectedFiltersOptions = {}): RenderSelectedFiltersAPI {
  DefaultFacetsService.instance = new DefaultFacetsService(new FilterEntityFactory());

  const facets: Record<Facet['id'], Facet> = {
    gender: createSimpleFacetStub('gender', createFilter => [
      createFilter('Men', false),
      createFilter('Women', false)
    ]),
    brand: createSimpleFacetStub('brand', createFilter => [
      createFilter('Audi', false),
      createFilter('BMW', false)
    ])
  };

  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(facetsXModule);
  resetXFacetsStateWith(store, facets);

  const wrapper = mount(
    {
      components: {
        SelectedFilters
      },
      template
    },
    {
      localVue,
      store
    }
  );

  const selectedFiltersWrapper = wrapper.findComponent(SelectedFilters);

  return {
    wrapper,
    selectedFiltersWrapper,
    toggleFacetNthFilter(facetId, nth) {
      const filter = store.getters['x/facets/facets'][facetId].filters[nth];
      DefaultFacetsService.instance.toggle(filter);
      return localVue.nextTick();
    }
  };
}

describe('testing SelectedFilters component', () => {
  it('is an x-component', () => {
    const { selectedFiltersWrapper } = renderSelectedFilters();
    expect(isXComponent(selectedFiltersWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { selectedFiltersWrapper } = renderSelectedFilters();
    expect(getXComponentXModuleName(selectedFiltersWrapper.vm)).toEqual('facets');
  });

  it('renders "nth" by default', async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = renderSelectedFilters({
      template: '<SelectedFilters :alwaysVisible="true" />'
    });
    expect(selectedFiltersWrapper.text()).toBe('0');
    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toBe('1');
    await toggleFacetNthFilter('brand', 1);
    expect(selectedFiltersWrapper.text()).toBe('2');
    await toggleFacetNthFilter('gender', 0);
    expect(selectedFiltersWrapper.text()).toBe('3');
  });

  it('renders "nth selected" in its customized slot', async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = renderSelectedFilters({
      template: `
        <SelectedFilters :alwaysVisible="true">
          <template #default="{ selectedFilters }">
            {{ selectedFilters.length }} selected
          </template>
        </SelectedFilters>`
    });
    expect(selectedFiltersWrapper.text()).toBe('0 selected');
    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toBe('1 selected');
    await toggleFacetNthFilter('brand', 1);
    expect(selectedFiltersWrapper.text()).toBe('2 selected');
    await toggleFacetNthFilter('gender', 0);
    expect(selectedFiltersWrapper.text()).toBe('3 selected');
  });

  it('renders "nth" by default of the facet id provided', async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = renderSelectedFilters({
      template: '<SelectedFilters facetId="brand" :alwaysVisible="true" />'
    });
    expect(selectedFiltersWrapper.text()).toBe('0');
    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toBe('1');
    await toggleFacetNthFilter('brand', 1);
    expect(selectedFiltersWrapper.text()).toBe('2');
    await toggleFacetNthFilter('gender', 0);
    expect(selectedFiltersWrapper.text()).toBe('2');
  });

  it('renders "nth selected" in its customized slot of the facet id provided', async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = renderSelectedFilters({
      template: `
        <SelectedFilters facetId="brand" :alwaysVisible="true">
          <template #default="{ selectedFilters }">
            {{ selectedFilters.length }} selected
          </template>
        </SelectedFilters>`
    });

    expect(selectedFiltersWrapper.text()).toBe('0 selected');
    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toBe('1 selected');
    await toggleFacetNthFilter('brand', 1);
    expect(selectedFiltersWrapper.text()).toBe('2 selected');
    await toggleFacetNthFilter('gender', 0);
    expect(selectedFiltersWrapper.text()).toBe('2 selected');
  });

  it('always renders the component if alwaysVisible is true without selected filters', async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = renderSelectedFilters({
      template: '<SelectedFilters :alwaysVisible="true" />'
    });

    expect(selectedFiltersWrapper.text()).toBe('0');
    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toBe('1');
  });

  it("doesn't render the component if alwaysVisible is false and no selected filters", async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = renderSelectedFilters();

    expect(selectedFiltersWrapper.html()).toBe('');
    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toBe('1');
  });
});

interface RenderSelectedFiltersOptions {
  /** The template to be rendered. */
  template?: string;
}

interface RenderSelectedFiltersAPI {
  /** The wrapper of the container element. */
  wrapper: Wrapper<Vue>;
  /** The `selectedFilters` wrapper component. */
  selectedFiltersWrapper: Wrapper<Vue>;
  /** Toggle nth filter of the facet provided. */
  toggleFacetNthFilter: (facetId: string, nth: number) => Promise<void>;
}
