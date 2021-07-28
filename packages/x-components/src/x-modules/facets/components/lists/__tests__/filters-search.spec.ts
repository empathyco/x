import { Filter } from '@empathyco/x-types-old';
import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { Dictionary } from '../../../../../utils/types';
import { getSimpleFilterStub } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import FiltersSearch from '../filters-search.vue';

const filtersMock: Filter[] = [
  'Lego city',
  'Lego CITY 2',
  'Lego Star Wars"',
  'LEGO BATMAN',
  'Lego batman 2',
  'LEGO Construcción',
  'Lego Coleccionista',
  'Lego Españita'
].map(label => getSimpleFilterStub({ label }));

const queries: Dictionary<number> = {
  '   ConsTRUCcióN  ': 1,
  a: 5,
  bat: 2,
  lego: 8,
  'go c': 4,
  '"': 1,
  ñ: 5
};

function renderFiltersSearch(
  dataTestInputSelector = 'filters-search-input',
  template?: string
): FiltersSearchAPI {
  const wrapper = mount(
    {
      components: { FiltersSearch },
      props: ['filters', 'debounceInMs'],
      template:
        template ??
        `
          <FiltersSearch :filters="filters" :debounceInMs="debounceInMs">
            <template #default="{ siftedFilters }">
              <ul v-for="filter in siftedFilters" data-test="filters-search-list">
                <li data-test="filters-search-list-item">{{ filter.label }}</li>
              </ul>
            </template>
          </FiltersSearch>
        `
    },
    {
      propsData: {
        filters: filtersMock
      }
    }
  );

  const filterWrapper = wrapper.findComponent(FiltersSearch);

  return {
    wrapper,
    filterWrapper,
    componentWrapper: wrapper.find(getDataTestSelector('filters-search')),
    inputWrapper: wrapper.find(getDataTestSelector(dataTestInputSelector)),
    getFiltersWrapper: () => wrapper.findAll(getDataTestSelector('filters-search-list-item'))
  };
}

describe('testing FiltersSearch', () => {
  beforeAll(jest.useFakeTimers);
  afterEach(jest.clearAllTimers);

  it('is an x-component', () => {
    const { filterWrapper } = renderFiltersSearch();

    expect(isXComponent(filterWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { filterWrapper } = renderFiltersSearch();

    expect(getXComponentXModuleName(filterWrapper.vm)).toEqual('facets');
  });

  it('renders the search input and provided filters', () => {
    const { wrapper, componentWrapper, inputWrapper, getFiltersWrapper } = renderFiltersSearch();

    expect(componentWrapper.element).toBeDefined();
    expect(inputWrapper.element).toBeDefined();
    expect(wrapper.classes()).not.toContain('x-filters-search--is-sifted');
    expect(getFiltersWrapper()).toHaveLength(filtersMock.length);
  });

  it('sifts provided filters with the input query', async () => {
    const filtersSearch = renderFiltersSearch();

    for (const [query, occurrences] of Object.entries(queries)) {
      await expectFiltersSearch(filtersSearch, query, occurrences);
      expect(filtersSearch.wrapper.classes()).toContain('x-filters-search--is-sifted');
    }
  });

  it('allows changing the debounce time', async () => {
    const filtersSearch = renderFiltersSearch();

    await filtersSearch.wrapper.setProps({ debounceInMs: 2000 });
    for (const [query, occurrences] of Object.entries(queries)) {
      await expectFiltersSearch(filtersSearch, query, filtersMock.length);
      expect(filtersSearch.wrapper.classes()).not.toContain('x-filters-search--is-sifted');

      jest.advanceTimersByTime(1800);
      await Vue.nextTick();
      expect(filtersSearch.getFiltersWrapper()).toHaveLength(occurrences);
      expect(filtersSearch.wrapper.classes()).toContain('x-filters-search--is-sifted');

      await filtersSearch.inputWrapper.setValue('');
      jest.advanceTimersByTime(2000);
      await Vue.nextTick();
      expect(filtersSearch.getFiltersWrapper()).toHaveLength(filtersMock.length);
    }
  });

  it('replaces the search slot content by a custom one', async () => {
    const filtersSearch = renderFiltersSearch(
      'custom-input',
      `
      <FiltersSearch :filters="filters" :debounceInMs="debounceInMs">
        <template #search="{ query, setQuery, clearQuery }">
          <input
            @input="setQuery($event.target.value)"
            :value="query"
            data-test="custom-input"/>
          <button @click="clearQuery" data-test="custom-clear-button">X</button>
        </template>
        <template #default="{ siftedFilters }">
          <ul v-for="filter in siftedFilters" data-test="filters-search-list">
            <li data-test="filters-search-list-item">{{ filter.label }}</li>
          </ul>
        </template>
      </FiltersSearch>
      `
    );

    for (const [query, occurrences] of Object.entries(queries)) {
      await expectFiltersSearch(filtersSearch, query, occurrences);
      expect(filtersSearch.wrapper.classes()).toContain('x-filters-search--is-sifted');
    }

    const clearButton = filtersSearch.wrapper.find(getDataTestSelector('custom-clear-button'));
    await clearButton.trigger('click');
    expect(filtersSearch.getFiltersWrapper()).toHaveLength(filtersMock.length);
    expect((filtersSearch.inputWrapper.element as HTMLInputElement).value).toEqual('');
  });
});

async function expectFiltersSearch(
  { inputWrapper, getFiltersWrapper }: FiltersSearchAPI,
  query: string,
  occurrences: number
): Promise<void> {
  await inputWrapper.setValue(query);
  expect((inputWrapper.element as HTMLInputElement).value).toEqual(query);
  jest.advanceTimersByTime(200);
  await Vue.nextTick();
  expect((inputWrapper.element as HTMLInputElement).value).toEqual(query);
  expect(getFiltersWrapper()).toHaveLength(occurrences);
}

interface FiltersSearchAPI {
  wrapper: Wrapper<Vue>;
  filterWrapper: Wrapper<Vue>;
  componentWrapper: Wrapper<Vue>;
  inputWrapper: Wrapper<Vue>;
  getFiltersWrapper: () => WrapperArray<Vue>;
}
