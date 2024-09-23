import { BooleanFilter, Facet } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Store } from 'vuex';
import { createSimpleFacetStub } from '../../../../../__stubs__';
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XPlugin } from '../../../../../plugins';
import { RootXStoreState } from '../../../../../store';
import { facetsXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
import SelectedFiltersList from '../../lists/selected-filters-list.vue';

/**
 * Renders the `SelectedFiltersList` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `SelectedFiltersList` component.
 */
function renderSelectedFiltersList({
  template = '<SelectedFiltersList :facetsIds="facetsIds" />',
  facetsIds = undefined as undefined | string[]
} = {}) {
  const facets: Record<Facet['id'], Facet> = {
    gender: createSimpleFacetStub('gender', createFilter => [
      createFilter('Men', false),
      createFilter('Women', false)
    ]),
    brand: createSimpleFacetStub('brand', createFilter => [
      createFilter('Audi', false),
      createFilter('BMW', false)
    ]),
    rootCategories: createSimpleFacetStub('root_categories', createFilter => [
      createFilter('Meat', false),
      createFilter('Vegetables', false)
    ])
  };

  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(
    {
      components: {
        SelectedFiltersList
      },
      template,
      data() {
        return {
          facetsIds
        };
      }
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [facetsXModule] })]
      },
      store,
      props: {
        facetsIds
      }
    }
  );
  installNewXPlugin({ store });
  XPlugin.registerXModule(facetsXModule);
  resetXFacetsStateWith(store, facets);
  const selectedFiltersListWrapper = wrapper.findComponent(SelectedFiltersList);

  return {
    wrapper,
    selectedFiltersListWrapper,
    toggleFacetNthFilter: (facetId: string, nth: number) => {
      const filter = (store.getters['x/facets/facets']![facetId].filters as BooleanFilter[])[nth];
      filter.selected = !filter.selected;
      return nextTick();
    },
    selectedFiltersItems: () =>
      selectedFiltersListWrapper.findAll(getDataTestSelector('selected-filters-list-item'))
  };
}

describe('testing SelectedFiltersList component', () => {
  it('is an x-component', () => {
    const { selectedFiltersListWrapper } = renderSelectedFiltersList();
    expect(isXComponent(selectedFiltersListWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { selectedFiltersListWrapper } = renderSelectedFiltersList();
    expect(getXComponentXModuleName(selectedFiltersListWrapper.vm)).toEqual('facets');
  });

  it("doesn't render anything if no filters are selected", () => {
    const { selectedFiltersListWrapper } = renderSelectedFiltersList();
    expect(selectedFiltersListWrapper.html()).toBe('');
  });

  it('renders filters label by default', async () => {
    const { selectedFiltersListWrapper, toggleFacetNthFilter } = renderSelectedFiltersList();
    await toggleFacetNthFilter('gender', 0);
    await toggleFacetNthFilter('brand', 1);

    const selectedFiltersItems = selectedFiltersListWrapper.findAll(
      getDataTestSelector('selected-filters-list-item')
    );

    expect(selectedFiltersItems.at(0)?.text()).toEqual('Men');
    expect(selectedFiltersItems.at(1)?.text()).toEqual('BMW');
  });

  it('renders custom default slot and custom facetId slot', async () => {
    const { selectedFiltersListWrapper, toggleFacetNthFilter } = renderSelectedFiltersList({
      template: `
        <SelectedFiltersList>
          <template #default="{ filter }">{{ filter.label }} selected!</template>
          <template #brand="{ filter }">Which one? {{ filter.label }}</template>
          <template #root-categories="{ filter }">Much better: {{ filter.label }}</template>
        </SelectedFiltersList>
      `
    });

    await toggleFacetNthFilter('gender', 0);
    await toggleFacetNthFilter('brand', 1);
    await toggleFacetNthFilter('rootCategories', 0);

    const selectedFiltersItems = selectedFiltersListWrapper.findAll(
      getDataTestSelector('selected-filters-list-item')
    );

    expect(selectedFiltersItems.at(0)?.text()).toEqual('Men selected!');
    expect(selectedFiltersItems.at(1)?.text()).toEqual('Which one? BMW');
    expect(selectedFiltersItems.at(2)?.text()).toEqual('Much better: Meat');
    expect(selectedFiltersItems).toHaveLength(3);
  });

  it('renders selectedFilters of the facets ids provided', async () => {
    const { selectedFiltersListWrapper, toggleFacetNthFilter, selectedFiltersItems } =
      renderSelectedFiltersList({
        facetsIds: ['brand', 'gender']
      });

    expect(selectedFiltersListWrapper.text()).toEqual('');

    await toggleFacetNthFilter('brand', 0);
    await toggleFacetNthFilter('rootCategories', 1);
    await toggleFacetNthFilter('gender', 1);

    expect(selectedFiltersItems()).toHaveLength(2);
    expect(selectedFiltersItems().at(0)?.text()).toEqual('Audi');
    expect(selectedFiltersItems().at(1)?.text()).toEqual('Women');
  });

  it('renders the component if alwaysVisible is true and no selected filters', () => {
    const { selectedFiltersListWrapper } = renderSelectedFiltersList({
      template: '<SelectedFiltersList :alwaysVisible="true" />'
    });

    expect(
      selectedFiltersListWrapper.find(getDataTestSelector('selected-filters-list')).exists()
    ).toBe(true);
  });

  it("doesn't render the component if alwaysVisible is false and no selected filters", () => {
    const { selectedFiltersListWrapper } = renderSelectedFiltersList();
    expect(selectedFiltersListWrapper.html()).toBe('');
  });
});
