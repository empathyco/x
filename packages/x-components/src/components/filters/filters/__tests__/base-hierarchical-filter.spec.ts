import { HierarchicalFilter } from '@empathy/search-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getHierarchicalFilterStub } from '../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../__tests__/utils';
import BaseHierarchical from '../base-hierarchical-filter.vue';

function renderBaseHierarchicalFilter({
  template = '<BaseHierarchical :filter="filter"/>',
  filter = getHierarchicalFilterStub()
}: BaseHierarchicalFilterOptions = {}): BaseHierarchicalFilterAPI {
  Vue.observable(filter);
  const emit = jest.fn();
  const wrapper = mount(
    {
      components: { BaseHierarchical },
      props: ['filter'],
      template
    },
    {
      propsData: {
        filter
      },
      mocks: {
        $x: {
          emit
        }
      }
    }
  );

  const filterWrapper = wrapper.find(getDataTestSelector('filter'));

  function setFilter(newFilter: HierarchicalFilter): Promise<void> {
    filter = newFilter;
    wrapper.setProps({ filter });
    return wrapper.vm.$nextTick();
  }

  function clickFilter(): void {
    filterWrapper.trigger('click');
  }

  function selectFilter(): Promise<void> {
    filter.selected = true;
    return wrapper.vm.$nextTick();
  }

  function getFilterModelsByDepth(): HierarchicalFilter[][] {
    const getFilterModels = (
      filters: HierarchicalFilter[],
      depth = 0,
      accumulator: HierarchicalFilter[][] = []
    ): HierarchicalFilter[][] => {
      if (!accumulator[depth]) {
        accumulator[depth] = [];
      }
      accumulator[depth].push(...filters);
      filters.forEach(childFilter => {
        getFilterModels(childFilter.children, depth + 1, accumulator);
      });
      return accumulator;
    };
    return getFilterModels([filter]);
  }

  function getFilterWrappersByDepth(): Wrapper<Vue>[][] {
    const filters = wrapper.findAll(getDataTestSelector('filter'));
    const containerSelector = getDataTestSelector('hierarchical-filter-container');
    return filters.wrappers.reduce<Wrapper<Vue>[][]>((depthLevels, filterWrapper) => {
      let depth = -1;
      let currentAncestor: Element | null | undefined = filterWrapper.element.closest(
        containerSelector
      );
      while (currentAncestor) {
        currentAncestor = currentAncestor.parentElement?.closest(containerSelector);
        depth++;
      }
      if (!depthLevels[depth]) {
        depthLevels[depth] = [];
      }
      depthLevels[depth].push(filterWrapper);
      return depthLevels;
    }, []);
  }

  function transverseFilters(
    callback: (wrapper: Wrapper<Vue>, filter: HierarchicalFilter) => void
  ): void {
    const filterModelsByDepth = getFilterModelsByDepth();
    const filterWrappersByDepth = getFilterWrappersByDepth();

    filterWrappersByDepth.forEach((filterWrappers, depth) => {
      filterWrappers.forEach((filterWrapper, index) => {
        callback(filterWrapper, filterModelsByDepth[depth][index]);
      });
    });
  }

  return {
    wrapper,
    emit,
    filter,
    filterWrapper,
    setFilter,
    clickFilter,
    selectFilter,
    getFilterModelsByDepth,
    getFilterWrappersByDepth,
    transverseFilters
  };
}

describe('testing `BaseHierarchicalFilter` component', () => {
  it('renders the provided filter by default', () => {
    const { wrapper, filter } = renderBaseHierarchicalFilter();

    expect(wrapper.text()).toEqual(filter.label);
  });

  it('emits `UserClickedAFilter` and `UserClickedAHierarchicalFilter` event when clicked', () => {
    const { filterWrapper, clickFilter, emit, filter } = renderBaseHierarchicalFilter();

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter, {
      target: filterWrapper.element
    });
    expect(emit).toHaveBeenCalledWith('UserClickedAHierarchicalFilter', filter, {
      target: filterWrapper.element
    });
  });

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = renderBaseHierarchicalFilter({
      template: `
      <BaseHierarchical :filter="filter" v-slot="{ filter }">
        <span data-test="custom-label">{{ filter.label }}</span>
      </BaseHierarchical>
      `
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.label);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { filterWrapper, selectFilter } = renderBaseHierarchicalFilter();

    expect(filterWrapper.classes()).not.toContain('x-filter--is-selected');
    expect(filterWrapper.classes()).not.toContain('x-hierarchical-filter--is-selected');

    await selectFilter();

    expect(filterWrapper.classes()).toContain('x-filter--is-selected');
    expect(filterWrapper.classes()).toContain('x-hierarchical-filter--is-selected');
  });

  describe('children testing', () => {
    const hierarchicalFilter = getHierarchicalFilterStub({
      id: 'root',
      selected: false,
      label: 'Root: Partially Selected',
      children: [
        getHierarchicalFilterStub({
          id: 'child-0',
          selected: true,
          label: 'Child 0: Partially-Selected',
          children: [
            getHierarchicalFilterStub({
              selected: false,
              id: 'grand-child-0',
              label: 'GrandChild 0: Unselected'
            }),
            getHierarchicalFilterStub({
              id: 'grand-child-1',
              selected: true,
              label: 'GrandChild 1: Selected'
            })
          ]
        }),
        getHierarchicalFilterStub({
          selected: true,
          id: 'child-1',
          label: 'Child 1: Selected'
        })
      ]
    });

    it('allows customizing the slot for all the children', () => {
      const { transverseFilters } = renderBaseHierarchicalFilter({
        filter: hierarchicalFilter,
        template: `
        <BaseHierarchical :filter="filter" v-slot="{ filter }">
          Custom - {{ filter.label }}
        </BaseHierarchical>`
      });

      transverseFilters((wrapper, filter) => {
        expect(wrapper.text()).toEqual(`Custom - ${filter.label}`);
      });
    });

    it('renders children filter only when available', async () => {
      const { wrapper, setFilter, transverseFilters } = renderBaseHierarchicalFilter({
        filter: getHierarchicalFilterStub({
          children: []
        })
      });

      const childrenFiltersWrapper = wrapper.find(getDataTestSelector('children-filters'));
      expect(childrenFiltersWrapper.element).toBeUndefined();

      await setFilter(hierarchicalFilter);

      transverseFilters((wrapper, filter) => {
        expect(wrapper.text()).toEqual(filter.label);
      });
    });

    // eslint-disable-next-line max-len
    it('emits `UserClickedAFilter` and `UserClickedAHierarchicalFilter` events when a child is clicked', () => {
      const {
        getFilterWrappersByDepth,
        getFilterModelsByDepth,
        emit
      } = renderBaseHierarchicalFilter({
        filter: hierarchicalFilter
      });

      const [, , [nestedFilterData]] = getFilterModelsByDepth();
      const [, , [nestedFilterWrapper]] = getFilterWrappersByDepth();
      nestedFilterWrapper.trigger('click');

      expect(emit).toHaveBeenCalledTimes(2);
      expect(emit).toHaveBeenCalledWith('UserClickedAFilter', nestedFilterData, {
        target: nestedFilterWrapper.element
      });
      expect(emit).toHaveBeenCalledWith('UserClickedAHierarchicalFilter', nestedFilterData, {
        target: nestedFilterWrapper.element
      });
    });

    it('adds a CSS class when the filter is partially selected', async () => {
      const targetClass = 'x-hierarchical-filter--is-partially-selected';
      const {
        getFilterModelsByDepth,
        getFilterWrappersByDepth,
        transverseFilters
      } = renderBaseHierarchicalFilter({
        filter: hierarchicalFilter
      });

      const [
        [rootFilterPartiallySelected],
        [childFilterPartiallySelected, childFilterSelected],
        [grandChildUnselected, grandChildSelected]
      ] = getFilterWrappersByDepth();
      const [, , [unselectedFilter]] = getFilterModelsByDepth();
      const partiallySelected = [rootFilterPartiallySelected, childFilterPartiallySelected];
      const notPartiallySelected = [childFilterSelected, grandChildUnselected, grandChildSelected];

      partiallySelected.forEach(filterWrapper => {
        expect(filterWrapper.classes()).toContain(targetClass);
      });
      notPartiallySelected.forEach(filterWrapper => {
        expect(filterWrapper.classes()).not.toContain(filterWrapper);
      });

      unselectedFilter.selected = true;
      await rootFilterPartiallySelected.vm.$nextTick();

      transverseFilters(filterWrapper => {
        expect(filterWrapper.classes()).not.toContain(filterWrapper);
      });
    });
  });
});

interface BaseHierarchicalFilterOptions {
  template?: string;
  filter?: HierarchicalFilter;
}

interface BaseHierarchicalFilterAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** The filter wrapper. This is the clickable element that represents the filter. */
  filterWrapper: Wrapper<Vue>;
  /** Mock for the `$x.emit` function. Can be used to check the emitted events. */
  emit: jest.Mock<any, any>;
  /** The data of the rendered hierarchical filter. */
  filter: HierarchicalFilter;
  /**
   * Changes the rendered filter.
   *
   * @param filter - The new filter to render.
   * @returns A promise that resolves after re-rendering the component.
   */
  setFilter: (filter: HierarchicalFilter) => Promise<void>;
  /**
   * Clicks the root filter.
   */
  clickFilter: () => void;
  /**
   * Changes the `selected` property of the rendered filter to `true`.
   *
   * @returns A promise that resolves after re-rendering the component.
   */
  selectFilter: () => Promise<void>;
  /**
   * Returns a list of the filters data grouped by depth. This list is sorted using a preorder
   * algorithm.
   *
   * @returns An array that contains the groups of filter data of the distinct depths.
   */
  getFilterModelsByDepth: () => HierarchicalFilter[][];
  /**
   * Returns a list of the filters wrappers grouped by depth. This list is sorted using a preorder
   * algorithm.
   *
   * @returns An array that contains the group of filter wrappers of the distinct depths.
   */
  getFilterWrappersByDepth: () => Wrapper<Vue>[][];
  /**
   * Transverse the filters using a preorder algorithm.
   *
   * @param callback - A callback does perform actions with the filter wrapper and the filter data.
   * For example, it can run some assertions.
   */
  transverseFilters: (
    callback: (wrapper: Wrapper<Vue>, filter: HierarchicalFilter) => void
  ) => void;
}
