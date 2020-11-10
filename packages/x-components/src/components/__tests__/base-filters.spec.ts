import { Filter } from '@empathy/search-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getFacetsStub } from '../../__stubs__/facets-stubs.factory';
import { getDataTestSelector } from '../../__tests__/utils';
import BaseFiltersComponent from '../base-filters.vue';

/**
 * Function that returns a BaseFilters wrapper.
 *
 * @param filters - BaseFilters filters props.
 * @returns BaseFilters vue-test-utils wrapper.
 */
function renderBaseFilters({
  filters = [],
  template = '<BaseFilters :filters="filters"></BaseFilters>'
}: RenderBaseFiltersOptions = {}): RenderBaseFiltersAPI {
  const localVue = createLocalVue();

  const wrapperTemplate = mount(
    {
      props: ['filters'],
      components: {
        BaseFilters: BaseFiltersComponent
      },
      template
    },
    {
      localVue,
      propsData: { filters }
    }
  );

  const wrapper = wrapperTemplate.findComponent(BaseFiltersComponent);

  return {
    wrapper,
    filters
  };
}

describe('testing BaseFilters component', () => {
  it('does not render anything when filters are empty', () => {
    const { wrapper } = renderBaseFilters();
    expect(wrapper.find(getDataTestSelector('base-filters')).exists()).toBe(false);
  });

  it('renders scoped slot correctly', () => {
    const filtersStub: Filter[] = getFacetsStub()[0].filters;
    const { wrapper } = renderBaseFilters({
      filters: filtersStub,
      template: `
        <BaseFilters :filters="filters" #default="{ filter }">
          <p>{{ filter.label }}</p>
        </BaseFilters>
      `
    });

    const liWrappers = wrapper.findAll(getDataTestSelector('base-filters-item'));
    filtersStub.forEach((filter, index) => {
      expect(liWrappers.at(index).text()).toContain(filter.label);
    });
  });
});

interface RenderBaseFiltersOptions {
  /** The filters data to render. */
  filters?: Filter[];
  /** The template to render. Receives the `filters` via prop, and has registered the
   * {@link BaseFiltersComponent} as `BaseFilters`. */
  template?: string;
}

interface RenderBaseFiltersAPI {
  /** The Vue testing utils wrapper for the {@link BaseFiltersComponent}. */
  wrapper: Wrapper<Vue>;
  /** The rendered filters data. */
  filters: Filter[];
}
