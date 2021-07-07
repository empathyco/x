import { Filter } from '@empathyco/x-types';
import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { getSimpleFilterStub } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import SimpleFilter from '../../filters/simple-filter.vue';
import ExcludeFiltersWithNoResults from '../exclude-filters-with-no-results.vue';
import FiltersSearch from '../filters-search.vue';
import Filters from '../filters.vue';
import SlicedFilters from '../sliced-filters.vue';

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

function renderFilters({
  max = 2,
  filters = getFiltersMock()
}: FiltersInjectionRenderOptions = {}): FiltersInjectionAPI {
  const wrapper = mount(
    {
      components: {
        FiltersSearch,
        SlicedFilters,
        ExcludeFiltersWithNoResults,
        Filters,
        SimpleFilter
      },
      props: ['filters', 'max'],
      template: `<ExcludeFiltersWithNoResults
        :filters="filters">
           <FiltersSearch>
             <SlicedFilters :max="max">
               <Filters v-slot="{ filter }" data-test="filters" >
                <SimpleFilter data-test="filter" :filter="filter"/>
               </Filters>
             </SlicedFilters>
           </FiltersSearch>
         </ExcludeFiltersWithNoResults>`
    },
    {
      propsData: {
        filters,
        max
      }
    }
  );

  return {
    wrapper,
    getFiltersWrapper: () => wrapper.findAll(getDataTestSelector('filter')),
    getShowMoreButton: () => wrapper.find(getDataTestSelector('sliced-filters-show-more-button')),
    async searchFilters(query) {
      wrapper.find(getDataTestSelector('filters-search-input')).setValue(query);
      jest.advanceTimersByTime(300);
      await Vue.nextTick();
    }
  };
}

describe('testing Filters injection', () => {
  beforeAll(jest.useFakeTimers);
  afterEach(jest.clearAllTimers);

  it('checks that the nested child receives the filters list by injection', async () => {
    const maxItemsToRender = 4;
    const label = 'Lego marvel';
    const query = 'lego city';
    const noResultsFilter = getSimpleFilterStub({ label, totalResults: 0 });

    const { getFiltersWrapper, searchFilters, getShowMoreButton } = renderFilters({
      max: maxItemsToRender,
      filters: [...getFiltersMock(), noResultsFilter]
    });

    await searchFilters(query);

    expect(getFiltersWrapper()).toBeDefined();
    expect(getFiltersWrapper().length).toBeLessThanOrEqual(maxItemsToRender);
    getFiltersWrapper().wrappers.forEach(filter => {
      expect(filter.text()).not.toEqual(label);
      expect(filter.text().toLowerCase()).toContain(query);
    });
    await getShowMoreButton().trigger('click');
    expect(getFiltersWrapper().length).toBeGreaterThan(maxItemsToRender);
  });
});

interface FiltersInjectionRenderOptions {
  /** The number of items to render. */
  max?: number;
  /** The list of filters. */
  filters?: Filter[];
}

interface FiltersInjectionAPI {
  /** The wrapper of the container element. */
  wrapper: Wrapper<Vue>;
  /** The filters of the wrapper element. */
  getFiltersWrapper: () => WrapperArray<Vue>;
  /** The show more button of the wrapper element. */
  getShowMoreButton: () => Wrapper<Vue>;
  /** The filters filtered by the query. */
  searchFilters: (query: string) => Promise<void>;
}
