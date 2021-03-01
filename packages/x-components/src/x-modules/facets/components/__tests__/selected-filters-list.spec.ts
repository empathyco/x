import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createSimpleFacetStub } from '../../../../__stubs__/facets-stubs.factory';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { RootXStoreState } from '../../../../store';
import { DeepPartial } from '../../../../utils';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { FacetsState } from '../../store';
import { facetsXModule } from '../../x-module';
import SelectedFiltersList from '../selected-filters-list.vue';
import { resetXFacetsStateWith } from './utils';

/**
 * Renders the `SelectedFiltersList` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `SelectedFiltersList` component.
 */
function renderSelectedFiltersList({
  template = '<SelectedFiltersList />'
}: RenderSelectedFiltersListOptions = {}): RenderSelectedFiltersAPI {
  const facetsState: Partial<FacetsState> = {
    backendFacets: {
      gender: createSimpleFacetStub('gender', createFilter => [
        createFilter('Men', false),
        createFilter('Women', false)
      ]),
      brand: createSimpleFacetStub('brand', createFilter => [
        createFilter('Audi', false),
        createFilter('BMW', false)
      ])
    }
  };

  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  XPlugin.resetInstance();
  XPlugin.registerXModule(facetsXModule);

  resetXFacetsStateWith(store, facetsState);
  const wrapper = mount(
    {
      components: {
        SelectedFiltersList
      },
      template
    },
    {
      localVue,
      store
    }
  );

  const selectedFiltersListWrapper = wrapper.findComponent(SelectedFiltersList);

  return {
    wrapper,
    selectedFiltersListWrapper,
    toggleFacetNthFilter(facetId, nth) {
      const filter = facetsState.backendFacets![facetId].filters[nth];
      filter.selected = !filter.selected;
      return localVue.nextTick();
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
        </SelectedFiltersList>
      `
    });

    await toggleFacetNthFilter('gender', 0);
    await toggleFacetNthFilter('brand', 1);

    const selectedFiltersItems = selectedFiltersListWrapper.findAll(
      getDataTestSelector('selected-filters-list-item')
    );

    expect(selectedFiltersItems.at(0).text()).toBe('Men selected!');
    expect(selectedFiltersItems.at(1).text()).toBe('Which one? BMW');
  });

  it('renders selectedFilters of the facet id provided', async () => {
    const { selectedFiltersListWrapper, toggleFacetNthFilter } = renderSelectedFiltersList({
      template: '<SelectedFiltersList facetId="brand" />'
    });
    expect(selectedFiltersListWrapper.text()).toBe('');
    await toggleFacetNthFilter('brand', 0);
    expect(selectedFiltersListWrapper.text()).toBe('Audi');
    await toggleFacetNthFilter('gender', 1);
    expect(selectedFiltersListWrapper.text()).toBe('Audi');
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
}

interface RenderSelectedFiltersAPI {
  /** The wrapper of the container element. */
  wrapper: Wrapper<Vue>;
  /** The `selectedFilters` wrapper component. */
  selectedFiltersListWrapper: Wrapper<Vue>;
  /** Toggle nth filter of the facet provided. */
  toggleFacetNthFilter: (facetId: string, nth: number) => Promise<void>;
}
