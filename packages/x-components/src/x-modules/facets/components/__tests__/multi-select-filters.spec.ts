import { BooleanFilter, Filter } from '@empathy/search-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { Dictionary } from '../../../../utils/types';
import { getSimpleFacetStub } from '../../../../__stubs__/facets-stubs.factory';
import { createCategorySimpleFilter } from '../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { facetsXModule } from '../../x-module';
import MultiSelectFilters from '../multi-select-filters.vue';

/**
 * Renders the `MultiSelectFilters` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `MultiSelectFilters` component.
 */
function renderMultiSelectFilters({
  filters = getSimpleFacetStub().filters,
  template = '<MultiSelectFilters :filters="filters"/>'
}: RenderFiltersOptions = {}): RenderFiltersAPI {
  XPlugin.resetInstance();
  const [, localVue] = installNewXPlugin();
  XPlugin.registerXModule(facetsXModule);

  const wrapperContainer = mount(
    {
      components: {
        MultiSelectFilters
      },
      template,
      props: ['filters']
    },
    {
      localVue,
      propsData: {
        filters: localVue.observable(filters)
      }
    }
  );

  const wrapper = wrapperContainer.findComponent(MultiSelectFilters);

  return {
    wrapper,
    filters,
    toggleNthFilter(nth) {
      const targetFilter = filters[nth];
      targetFilter.selected = !targetFilter.selected;
      return localVue.nextTick();
    },
    setFilters(filters) {
      wrapperContainer.setProps({ filters });
      return localVue.nextTick();
    },
    getStoreMultiSelectFacets() {
      const xState: RootXStoreState = wrapper.vm.$store.state;
      return xState.x.facets.config.multiSelect;
    }
  };
}

describe('testing MultiSelectFilters component', () => {
  it('is an x-component', () => {
    const { wrapper } = renderMultiSelectFilters();

    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { wrapper } = renderMultiSelectFilters();

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
  });

  it('does not render anything if there are no filters', () => {
    const { wrapper } = renderMultiSelectFilters({ filters: [] });
    expect(wrapper.html()).toEqual('');
  });

  it('has an slot to customize each filter', () => {
    const { wrapper, filters } = renderMultiSelectFilters({
      template: `
          <MultiSelectFilters :filters="filters" v-slot="{ filter }">
            <button data-test="custom-filter">{{ filter.label }}</button>
          </MultiSelectFilters>`
    });

    const customFiltersWrapper = wrapper.findAll(getDataTestSelector('custom-filter'));

    customFiltersWrapper.wrappers.forEach((customFilterWrapper, index) => {
      expect(customFilterWrapper.text()).toEqual(filters[index].label);
    });
  });

  it('adds a class when there is at least one filter selected', async () => {
    const targetClass = 'x-filters--has-selected-filters';
    const { wrapper, toggleNthFilter } = renderMultiSelectFilters({
      filters: [
        createCategorySimpleFilter('shirts', false),
        createCategorySimpleFilter('jeans', true)
      ]
    });

    expect(wrapper.classes()).toContain(targetClass);

    await toggleNthFilter(1);
    expect(wrapper.classes()).not.toContain(targetClass);
  });

  it('sets the multi-select config for the facet of the filters in the store', () => {
    const { filters, getStoreMultiSelectFacets } = renderMultiSelectFilters();
    const storeMultiSelect = getStoreMultiSelectFacets();
    const facetId = filters[0].facetId;

    expect(storeMultiSelect).toEqual({ [facetId]: true });
  });

  it("does not set the multi-select config if there aren't any filters", async () => {
    const { getStoreMultiSelectFacets, setFilters } = renderMultiSelectFilters({
      filters: []
    });
    const storeMultiSelect = getStoreMultiSelectFacets();

    expect(storeMultiSelect).toEqual({});

    const facet = getSimpleFacetStub();
    await setFilters(facet.filters);
    expect(storeMultiSelect).toEqual({ [facet.id]: true });
  });
});

interface RenderFiltersOptions {
  /** The filters list to be rendered. */
  filters?: BooleanFilter[];
  /** The template to be rendered. It contains the `Filters` component registered, plus the`filters`
   * and `multiSelect` props. */
  template?: string;
}

interface RenderFiltersAPI {
  /** The `Filters` wrapper component, with testing utilities. */
  wrapper: Wrapper<Vue>;
  /** The filters list to be rendered. */
  filters: BooleanFilter[];
  /**
   * Changes the `filters` prop to the provided value.
   *
   * @param filters - The new filters list.
   * @returns A promise that resolves after re-rendering the component.
   */
  setFilters: (filters: Filter[]) => Promise<void>;
  /**
   * Retrieves the store multi-select option.
   *
   * @returns The multiselect configuration for all the facets.
   */
  getStoreMultiSelectFacets: () => Dictionary<boolean>;
  /**
   * Toggles the `selected` state of the nth filter.
   *
   * @param nth - The number of the filter to toggle its `selected` state.
   * @returns A promise that resolves after re-rendering the component.
   */
  toggleNthFilter: (nth: number) => Promise<void>;
}
