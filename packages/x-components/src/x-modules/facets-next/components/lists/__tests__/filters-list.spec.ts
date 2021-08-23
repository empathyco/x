import { Filter } from '@empathyco/x-types-next';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { createNextSimpleFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import FiltersList from '../filters-list.vue';

/**
 * Function that returns a Filters wrapper.
 *
 * @param filters - Filters filters props.
 * @returns FiltersList vue-test-utils wrapper.
 */
function renderFilters({
  filters = [],
  template = '<Filters :filters="filters"></Filters>'
}: RenderFiltersOptions = {}): RenderFiltersAPI {
  const localVue = createLocalVue();

  const wrapperTemplate = mount(
    {
      props: ['filters'],
      components: {
        Filters: FiltersList
      },
      template
    },
    {
      localVue,
      propsData: { filters }
    }
  );

  const wrapper = wrapperTemplate.findComponent(FiltersList);

  return {
    wrapper,
    filters
  };
}

describe('testing Filters component', () => {
  it('is an x-component', () => {
    const { wrapper } = renderFilters();

    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { wrapper } = renderFilters();

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facetsNext');
  });

  it('does not render anything when filters are empty', () => {
    const { wrapper } = renderFilters();
    expect(wrapper.find(getDataTestSelector('base-filters')).exists()).toBe(false);
  });

  it('renders scoped slot correctly', () => {
    const filters = createNextSimpleFacetStub('color', createFilter => [
      createFilter('red'),
      createFilter('blue'),
      createFilter('green')
    ]).filters;
    const { wrapper } = renderFilters({
      filters,
      template: `
        <Filters :filters="filters" #default="{ filter }">
        <p>{{ filter.label }}</p>
        </Filters>
      `
    });

    const liWrappers = wrapper.findAll(getDataTestSelector('base-filters-item'));
    filters.forEach((filter, index) => {
      expect(liWrappers.at(index).text()).toContain(filter.label);
    });
  });
});

interface RenderFiltersOptions {
  /** The filters data to render. */
  filters?: Filter[];
  /** The template to render. Receives the `filters` via prop, and has registered the
   * {@link FiltersComponent} as `Filters`. */
  template?: string;
}

interface RenderFiltersAPI {
  /** The rendered filters data. */
  filters: Filter[];
  /** The Vue testing utils wrapper for the {@link FiltersComponent}. */
  wrapper: Wrapper<Vue>;
}
