import { Filter } from '@empathyco/x-types-old';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getFacetsStub } from '../../../../../__stubs__/facets-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import Filters from '../filters.vue';

/**
 * Function that returns a Filters wrapper.
 *
 * @param filters - Filters filters props.
 * @returns Filters vue-test-utils wrapper.
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
        Filters
      },
      template
    },
    {
      localVue,
      propsData: { filters }
    }
  );

  const wrapper = wrapperTemplate.findComponent(Filters);

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

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
  });

  it('does not render anything when filters are empty', () => {
    const { wrapper } = renderFilters();
    expect(wrapper.find(getDataTestSelector('base-filters')).exists()).toBe(false);
  });

  it('renders scoped slot correctly', () => {
    const filtersStub: Filter[] = getFacetsStub()[0].filters;
    const { wrapper } = renderFilters({
      filters: filtersStub,
      template: `
        <Filters :filters="filters" #default="{ filter }">
          <p>{{ filter.label }}</p>
        </Filters>
      `
    });

    const liWrappers = wrapper.findAll(getDataTestSelector('base-filters-item'));
    filtersStub.forEach((filter, index) => {
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
  /** The Vue testing utils wrapper for the {@link FiltersComponent}. */
  wrapper: Wrapper<Vue>;
  /** The rendered filters data. */
  filters: Filter[];
}
