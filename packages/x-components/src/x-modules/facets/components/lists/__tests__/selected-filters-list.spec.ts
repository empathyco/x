import { BooleanFilter, Facet } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createSimpleFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
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
  facetsIds = undefined
}: RenderSelectedFiltersListOptions = {}): RenderSelectedFiltersAPI {
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

  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(facetsXModule);
  resetXFacetsStateWith(store, facets);

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
      localVue,
      store,
      propsData: {
        facetsIds
      }
    }
  );

  const selectedFiltersListWrapper = wrapper.findComponent(SelectedFiltersList);

  return {
    wrapper,
    selectedFiltersListWrapper,
    toggleFacetNthFilter(facetId, nth) {
      const filter = (store.getters['x/facets/facets']![facetId].filters as BooleanFilter[])[nth];
      filter.selected = !filter.selected;
      return localVue.nextTick();
    },
    selectedFiltersItems() {
      return selectedFiltersListWrapper.findAll(getDataTestSelector('selected-filters-list-item'));
    }
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

    expect(selectedFiltersItems.at(0).text()).toBe('Men');
    expect(selectedFiltersItems.at(1).text()).toBe('BMW');
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

    expect(selectedFiltersItems.at(0).text()).toBe('Men selected!');
    expect(selectedFiltersItems.at(1).text()).toBe('Which one? BMW');
    expect(selectedFiltersItems.at(2).text()).toBe('Much better: Meat');
    expect(selectedFiltersItems).toHaveLength(3);
  });

  it('renders selectedFilters of the facets ids provided', async () => {
    const { selectedFiltersListWrapper, toggleFacetNthFilter, selectedFiltersItems } =
      renderSelectedFiltersList({
        facetsIds: ['brand', 'gender']
      });

    expect(selectedFiltersListWrapper.text()).toBe('');

    await toggleFacetNthFilter('brand', 0);
    await toggleFacetNthFilter('rootCategories', 1);
    await toggleFacetNthFilter('gender', 1);

    expect(selectedFiltersItems()).toHaveLength(2);
    expect(selectedFiltersItems().at(0).text()).toBe('Audi');
    expect(selectedFiltersItems().at(1).text()).toBe('Women');
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

interface RenderSelectedFiltersListOptions {
  /** The template to be rendered. */
  template?: string;
  /** Array of facets ids. */
  facetsIds?: Array<Facet['id']>;
}

interface RenderSelectedFiltersAPI {
  /** The wrapper of the container element. */
  wrapper: Wrapper<Vue>;
  /** The `selectedFilters` wrapper component. */
  selectedFiltersListWrapper: Wrapper<Vue>;
  /** Toggle nth filter of the facet provided. */
  toggleFacetNthFilter: (facetId: string, nth: number) => Promise<void>;
  /** Retrieves the wrapper for the items of the list rendered by the {@link SelectedFiltersList}
   * component. */
  selectedFiltersItems: () => WrapperArray<Vue>;
}
