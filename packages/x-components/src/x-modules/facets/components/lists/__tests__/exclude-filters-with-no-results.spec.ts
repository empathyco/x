import { Filter } from '@empathyco/x-types-old';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { getSimpleFilterStub } from '../../../../../__stubs__/filters-stubs.factory';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import ExcludeFiltersWithNoResults from '../exclude-filters-with-no-results.vue';

/**
 * Renders a {@link ExcludeFiltersWithNoResults} component with the provided options, and returns
 * a small API to test it.
 *
 * @param options - Options to test the {@link ExcludeFiltersWithNoResults} component with.
 * @returns A {@link RenderExcludeFiltersWithNoResultsAPI} object to test the
 * {@link ExcludeFiltersWithNoResults}.
 */
function renderExcludeFiltersWithNoResults({
  filters = [],
  template = `
    <ExcludeFiltersWithNoResults :filters="filters" v-slot="{ filters }">
      <div>
        <span class="filter" v-for="filter in filters">{{ filter.label }}</span>
      </div>
    </ExcludeFiltersWithNoResults>`
}: RenderExcludeFiltersWithNoResultsOptions = {}): RenderExcludeFiltersWithNoResultsAPI {
  const localVue = createLocalVue();

  const templateWrapper = mount(
    {
      props: ['filters'],
      components: {
        ExcludeFiltersWithNoResults
      },
      template
    },
    {
      localVue,
      propsData: { filters }
    }
  );

  const wrapper = templateWrapper.findComponent(ExcludeFiltersWithNoResults);
  return {
    wrapper,
    getRenderedFilters() {
      return templateWrapper.findAll('.filter');
    }
  };
}

describe('testing Filters component', () => {
  it('is an x-component', () => {
    const { wrapper } = renderExcludeFiltersWithNoResults();

    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { wrapper } = renderExcludeFiltersWithNoResults();

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
  });

  it('excludes filters with totalResults=0', () => {
    const { getRenderedFilters } = renderExcludeFiltersWithNoResults({
      filters: [
        getSimpleFilterStub({ label: 'Men', totalResults: 0 }),
        getSimpleFilterStub({ label: 'Women', totalResults: 10 }),
        getSimpleFilterStub({ label: 'Kids', totalResults: undefined })
      ]
    });
    const renderedFilters = getRenderedFilters();
    expect(renderedFilters).toHaveLength(2);
    expect(renderedFilters.wrappers.map(wrapper => wrapper.text())).toEqual(['Women', 'Kids']);
  });
});

interface RenderExcludeFiltersWithNoResultsOptions {
  /** The filters data to render. */
  filters?: Filter[];
  /** The template to render. Receives the `filters` via prop, and has registered the
   * {@link ExcludeFiltersWithNoResults} component. */
  template?: string;
}

interface RenderExcludeFiltersWithNoResultsAPI {
  /** Retrieves the testing wrappers of the filters. */
  getRenderedFilters: () => WrapperArray<Vue>;
  /** The Vue testing utils wrapper for the {@link ExcludeFiltersWithNoResults} component. */
  wrapper: Wrapper<Vue>;
}
