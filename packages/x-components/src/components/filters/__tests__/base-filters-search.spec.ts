import { Filter } from '@empathy/search-types';
import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { Dictionary } from '../../../utils/types';
import { getSimpleFilterStub } from '../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseFiltersSearch from '../../filters/base-filters-search.vue';

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

function renderBaseFiltersSearch(
  dataTestInputSelector = 'filters-search-input',
  template?: string
): BaseFiltersSearchAPI {
  const wrapper = mount(
    {
      components: { BaseFiltersSearch },
      props: ['filters', 'debounceInMs'],
      template:
        template ??
        `
          <BaseFiltersSearch :filters="filters" :debounceInMs="debounceInMs">
            <template #default="{ siftedFilters }">
              <ul v-for="filter in siftedFilters" data-test="filters-search-list">
                <li data-test="filters-search-list-item">{{ filter.label }}</li>
              </ul>
            </template>
          </BaseFiltersSearch>
        `
    },
    {
      propsData: {
        filters: filtersMock
      }
    }
  );

  return {
    wrapper,
    componentWrapper: wrapper.find(getDataTestSelector('filters-search')),
    inputWrapper: wrapper.find(getDataTestSelector(dataTestInputSelector)),
    getFiltersWrapper: () => wrapper.findAll(getDataTestSelector('filters-search-list-item'))
  };
}

describe('testing BaseFiltersSearch', () => {
  beforeAll(jest.useFakeTimers);
  afterEach(jest.clearAllTimers);

  it('renders the search input and provided filters', () => {
    const {
      wrapper,
      componentWrapper,
      inputWrapper,
      getFiltersWrapper
    } = renderBaseFiltersSearch();

    expect(componentWrapper.element).toBeDefined();
    expect(inputWrapper.element).toBeDefined();
    expect(wrapper.classes()).not.toContain('x-filters-search--is-sifted');
    expect(getFiltersWrapper()).toHaveLength(filtersMock.length);
  });

  it('sifts provided filters with the input query', async () => {
    const baseFiltersSearch = renderBaseFiltersSearch();

    for (const [query, occurrences] of Object.entries(queries)) {
      await expectBaseFiltersSearch(baseFiltersSearch, query, occurrences);
      expect(baseFiltersSearch.wrapper.classes()).toContain('x-filters-search--is-sifted');
    }
  });

  it('allows changing the debounce time', async () => {
    const baseFiltersSearch = renderBaseFiltersSearch();

    await baseFiltersSearch.wrapper.setProps({ debounceInMs: 2000 });
    for (const [query, occurrences] of Object.entries(queries)) {
      await expectBaseFiltersSearch(baseFiltersSearch, query, filtersMock.length);
      expect(baseFiltersSearch.wrapper.classes()).not.toContain('x-filters-search--is-sifted');

      jest.advanceTimersByTime(1800);
      await Vue.nextTick();
      expect(baseFiltersSearch.getFiltersWrapper()).toHaveLength(occurrences);
      expect(baseFiltersSearch.wrapper.classes()).toContain('x-filters-search--is-sifted');

      await baseFiltersSearch.inputWrapper.setValue('');
      jest.advanceTimersByTime(2000);
      await Vue.nextTick();
      expect(baseFiltersSearch.getFiltersWrapper()).toHaveLength(filtersMock.length);
    }
  });

  it('replaces the search slot content by a custom one', async () => {
    const baseFiltersSearch = renderBaseFiltersSearch(
      'custom-input',
      `
      <BaseFiltersSearch :filters="filters" :debounceInMs="debounceInMs">
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
      </BaseFiltersSearch>
      `
    );

    for (const [query, occurrences] of Object.entries(queries)) {
      await expectBaseFiltersSearch(baseFiltersSearch, query, occurrences);
      expect(baseFiltersSearch.wrapper.classes()).toContain('x-filters-search--is-sifted');
    }

    const clearButton = baseFiltersSearch.wrapper.find(getDataTestSelector('custom-clear-button'));
    await clearButton.trigger('click');
    expect(baseFiltersSearch.getFiltersWrapper()).toHaveLength(filtersMock.length);
    expect((baseFiltersSearch.inputWrapper.element as HTMLInputElement).value).toEqual('');
  });
});

async function expectBaseFiltersSearch(
  { inputWrapper, getFiltersWrapper }: BaseFiltersSearchAPI,
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

interface BaseFiltersSearchAPI {
  wrapper: Wrapper<Vue>;
  componentWrapper: Wrapper<Vue>;
  inputWrapper: Wrapper<Vue>;
  getFiltersWrapper: () => WrapperArray<Vue>;
}
