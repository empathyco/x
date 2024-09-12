import { Facet } from '@empathyco/x-types';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createSimpleFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
import { installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { facetsXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
import SelectedFilters from '../selected-filters.vue';
import { resetFacetsService } from '../../../__tests__/utils';
import { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { RootXStoreState } from '../../../../../store/index';

function render({ template = '<SelectedFilters />', facetsIds = [] as string[] } = {}) {
  resetFacetsService();

  const facets: Record<Facet['id'], Facet> = {
    gender: createSimpleFacetStub('gender', createFilter => [
      createFilter('Men', false),
      createFilter('Women', false)
    ]),
    brand: createSimpleFacetStub('brand', createFilter => [
      createFilter('Audi', false),
      createFilter('BMW', false)
    ]),
    color: createSimpleFacetStub('color', createFilter => [
      createFilter('red', false),
      createFilter('blue', false)
    ])
  };

  const store = new Store<DeepPartial<RootXStoreState>>({});
  const wrapper = mount(
    {
      components: { SelectedFilters },
      template
    },
    {
      store,
      global: { plugins: [installNewXPlugin({ store, initialXModules: [facetsXModule] })] },
      data: () => {
        return { facetsIds };
      }
    }
  );
  resetXFacetsStateWith(store, facets);
  nextTick();

  const selectedFiltersWrapper = wrapper.findComponent(SelectedFilters);

  return {
    wrapper,
    selectedFiltersWrapper,
    toggleFacetNthFilter: async (facetId: string, nth: number) => {
      const filter = store.getters['x/facets/facets'][facetId].filters[nth];
      filter.selected = !filter.selected;
      return await nextTick();
    }
  };
}

describe('testing SelectedFilters component', () => {
  it('is an x-component', () => {
    const { selectedFiltersWrapper } = render();

    expect(isXComponent(selectedFiltersWrapper.vm)).toBeTruthy();
  });

  it('belongs to the `facets` x-module', () => {
    const { selectedFiltersWrapper } = render();

    expect(getXComponentXModuleName(selectedFiltersWrapper.vm)).toEqual('facets');
  });

  it('renders "nth" by default', async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = render({
      template: '<SelectedFilters :alwaysVisible="true" />'
    });

    expect(selectedFiltersWrapper.text()).toEqual('0');

    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toEqual('1');

    await toggleFacetNthFilter('brand', 1);
    expect(selectedFiltersWrapper.text()).toEqual('2');

    await toggleFacetNthFilter('gender', 0);
    expect(selectedFiltersWrapper.text()).toEqual('3');
  });

  it('renders "nth selected" in its customized slot', async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = render({
      template: `
        <SelectedFilters :alwaysVisible="true" #default="{ selectedFilters }">
          {{ selectedFilters.length }} selected
        </SelectedFilters>`
    });

    expect(selectedFiltersWrapper.text()).toEqual('0 selected');

    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toEqual('1 selected');

    await toggleFacetNthFilter('brand', 1);
    expect(selectedFiltersWrapper.text()).toEqual('2 selected');

    await toggleFacetNthFilter('gender', 0);
    expect(selectedFiltersWrapper.text()).toEqual('3 selected');
  });

  it('renders "nth" by default of the facet ids provided', async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = render({
      template: '<SelectedFilters :facetsIds="facetsIds" :alwaysVisible="true" />',
      facetsIds: ['brand', 'gender']
    });

    expect(selectedFiltersWrapper.text()).toEqual('0');

    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toEqual('1');

    await toggleFacetNthFilter('brand', 1);
    expect(selectedFiltersWrapper.text()).toEqual('2');

    await toggleFacetNthFilter('gender', 0);
    expect(selectedFiltersWrapper.text()).toEqual('3');

    await toggleFacetNthFilter('color', 0);
    expect(selectedFiltersWrapper.text()).toEqual('3');
  });

  it('renders "nth selected" in its customized slot of the facet id provided', async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = render({
      template: `
        <SelectedFilters :facetsIds="facetsIds" :alwaysVisible="true" #default="{ selectedFilters }">
          {{ selectedFilters.length }} selected
        </SelectedFilters>`,
      facetsIds: ['brand']
    });

    expect(selectedFiltersWrapper.text()).toEqual('0 selected');

    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toEqual('1 selected');

    await toggleFacetNthFilter('brand', 1);
    expect(selectedFiltersWrapper.text()).toEqual('2 selected');

    await toggleFacetNthFilter('gender', 0);
    expect(selectedFiltersWrapper.text()).toEqual('2 selected');
  });

  it('always renders the component if alwaysVisible is true without selected filters', async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = render({
      template: '<SelectedFilters :alwaysVisible="true" />'
    });

    expect(selectedFiltersWrapper.text()).toEqual('0');

    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toEqual('1');
  });

  it("doesn't render the component if alwaysVisible is false and no selected filters", async () => {
    const { selectedFiltersWrapper, toggleFacetNthFilter } = render();

    expect(selectedFiltersWrapper.html()).toEqual('');

    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersWrapper.text()).toEqual('1');
  });
});
