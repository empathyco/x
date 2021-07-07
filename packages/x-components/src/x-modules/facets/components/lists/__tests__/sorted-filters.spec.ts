import { BooleanFilter, Filter } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { getSimpleFilterStub } from '../../../../../__stubs__/filters-stubs.factory';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import SortedFilters from '../sorted-filters.vue';
import { getDataTestSelector } from '../../../../../__tests__/utils';

const filterLabels: string[] = [
  'Lego city',
  'Lego CITY 2',
  'Lego city marvel',
  'Lego city juego',
  'Lego city 3',
  'LEGO BATMAN',
  'Lego batman 2'
];

function getFiltersMock(): Filter[] {
  return filterLabels.map((label, index) => getSimpleFilterStub({ label, id: index }));
}

function renderBaseSortedFilters(filters: Filter[]): BaseSortedFiltersAPI {
  const localVue = createLocalVue();
  Vue.observable(filters);

  const wrapper = mount(
    {
      components: {
        SortedFilters
      },
      props: ['filters'],
      template: `
        <SortedFilters :filters="filters" v-slot="{ filters }">
          <div>
            <button
              v-for="filter in filters"
              data-test="sorted-filter"
              :aria-checked="filter.selected.toString()"
              role="checkbox"
            >
              {{ filter.label }}
            </button>
          </div>
        </SortedFilters>`
    },
    {
      localVue,
      propsData: {
        filters
      }
    }
  );

  return {
    getFiltersWrapperArray: () => wrapper.findAll(getDataTestSelector('sorted-filter')),
    getSortedFiltersWrapper: () => wrapper.findComponent(SortedFilters),
    selectFilter: index => {
      (filters[index] as BooleanFilter).selected = true;
      return Vue.nextTick();
    }
  };
}

describe('testing SortedFilters', () => {
  it('is an x-component', () => {
    const filters = getFiltersMock();
    const { getSortedFiltersWrapper } = renderBaseSortedFilters(filters);

    expect(isXComponent(getSortedFiltersWrapper().vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const filters = getFiltersMock();
    const { getSortedFiltersWrapper } = renderBaseSortedFilters(filters);

    expect(getXComponentXModuleName(getSortedFiltersWrapper().vm)).toEqual('facets');
  });

  it('does not render any filter if filters array is empty', () => {
    const filters: Filter[] = [];
    const { getFiltersWrapperArray } = renderBaseSortedFilters(filters);

    expect(getFiltersWrapperArray()).toHaveLength(0);
  });

  it('should show first the selected filters of the filter list', async () => {
    const filters = getFiltersMock();
    const { getFiltersWrapperArray, selectFilter } = renderBaseSortedFilters(filters);
    const expectedLabel = 'Lego CITY 2';

    const filterToSelect = getFiltersWrapperArray().at(1);
    expect(filterToSelect.text()).toEqual(expectedLabel);
    expect(filterToSelect.attributes()).toHaveProperty('aria-checked', 'false');

    await selectFilter(1);

    const selectedFilter = getFiltersWrapperArray().at(0);
    expect(selectedFilter.text()).toEqual(expectedLabel);
    expect(selectedFilter.attributes()).toHaveProperty('aria-checked', 'true');
  });
});

interface BaseSortedFiltersAPI {
  /** The filters of the wrapper element. */
  getFiltersWrapperArray: () => WrapperArray<Vue>;
  /** The wrapper of the component. */
  getSortedFiltersWrapper: () => Wrapper<Vue>;
  /** Sets the index filter selected property to true. */
  selectFilter: (index: number) => Promise<void>;
}
