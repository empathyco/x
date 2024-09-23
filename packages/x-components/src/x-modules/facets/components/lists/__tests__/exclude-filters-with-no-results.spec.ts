import { SimpleFilter } from '@empathyco/x-types';
import { mount } from '@vue/test-utils';
import { getSimpleFilterStub } from '../../../../../__stubs__';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import ExcludeFiltersWithNoResults from '../exclude-filters-with-no-results.vue';

function renderExcludeFiltersWithNoResults({
  filters = [] as SimpleFilter[],
  template = `
    <ExcludeFiltersWithNoResults :filters="filters" v-slot="{ filters }">
      <div>
        <span class="filter" v-for="filter in filters">{{ filter.label }}</span>
      </div>
    </ExcludeFiltersWithNoResults>`
} = {}) {
  const templateWrapper = mount(
    {
      props: ['filters'],
      components: {
        ExcludeFiltersWithNoResults
      },
      template
    },
    {
      props: { filters }
    }
  );

  const wrapper = templateWrapper.findComponent(ExcludeFiltersWithNoResults);
  return {
    wrapper,
    getRenderedFilters: () => templateWrapper.findAll('.filter')
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
    expect(renderedFilters.map(wrapper => wrapper.text())).toEqual(['Women', 'Kids']);
  });
});
