import { HierarchicalFilter as HierarchicalFilterModel } from '@empathyco/x-types';
import { deepMerge } from '@empathyco/x-deep-merge';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getHierarchicalFilterStub } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XEvent } from '../../../../../wiring/events.types';
import HierarchicalFilter from '../hierarchical-filter.vue';

function renderHierarchicalFilter({
  template = `<HierarchicalFilter :filter="filter" />`,
  filter = getHierarchicalFilterStub()
}: HierarchicalFilterOptions = {}): HierarchicalFilterAPI {
  Vue.observable(filter);
  const emit = jest.fn();
  const wrapper = mount(
    {
      components: { HierarchicalFilter },
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
  const hierarchicalFilterWrapper = wrapper.findComponent(HierarchicalFilter);

  async function setFilter(newFilter: HierarchicalFilterModel): Promise<void> {
    filter = newFilter;
    await wrapper.setProps({ filter });
  }

  async function clickFilter(): Promise<void> {
    await filterWrapper.trigger('click');
  }

  function updateFilter(newFields: Partial<HierarchicalFilterModel>): Promise<void> {
    deepMerge(filter, newFields);
    return wrapper.vm.$nextTick();
  }

  function getFilterModelsByDepth(): HierarchicalFilterModel[][] {
    const getFilterModels = (
      filters: HierarchicalFilterModel[],
      depth = 0,
      accumulator: HierarchicalFilterModel[][] = []
    ): HierarchicalFilterModel[][] => {
      if (!accumulator[depth]) {
        accumulator[depth] = [];
      }
      accumulator[depth].push(...filters);
      filters.forEach(childFilter => {
        getFilterModels(childFilter.children!, depth + 1, accumulator);
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
      let currentAncestor: Element | null | undefined =
        filterWrapper.element.closest(containerSelector);
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
    callback: (wrapper: Wrapper<Vue>, filter: HierarchicalFilterModel) => void
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
    filterWrapper,
    hierarchicalFilterWrapper,
    emit,
    filter,
    setFilter,
    clickFilter,
    updateFilter,
    getFilterModelsByDepth,
    getFilterWrappersByDepth,
    transverseFilters
  };
}

describe('testing `HierarchicalFilter` component', () => {
  it('is an x-component', () => {
    const { hierarchicalFilterWrapper } = renderHierarchicalFilter();

    expect(isXComponent(hierarchicalFilterWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { hierarchicalFilterWrapper } = renderHierarchicalFilter();

    expect(getXComponentXModuleName(hierarchicalFilterWrapper.vm)).toEqual('facets');
  });

  it('renders the provided filter by default', () => {
    const { wrapper, filter } = renderHierarchicalFilter();

    expect(wrapper.text()).toEqual(filter.label);
  });

  it('emits `UserClickedAFilter` and `UserClickedAHierarchicalFilter` event when clicked', () => {
    const { filterWrapper, clickFilter, emit, filter } = renderHierarchicalFilter();

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter, {
      target: filterWrapper.element
    });
    expect(emit).toHaveBeenCalledWith('UserClickedAHierarchicalFilter', filter, {
      target: filterWrapper.element
    });
  });

  it('allows replacing the root element of the component', () => {
    const { wrapper, filter, emit } = renderHierarchicalFilter({
      template: `
      <HierarchicalFilter :filter="filter" v-slot="{ filter, clickFilter }">
        <label data-test="custom-label">
          <input data-test="custom-input"
            type="checkbox"
            @change="clickFilter"
          >
          {{ filter.label }}
        </label>
      </HierarchicalFilter>
      `
    });

    const customLabelWrapper = wrapper.find(getDataTestSelector('custom-label'));
    const customInputWrapper = wrapper.find(getDataTestSelector('custom-input'));
    expect(customLabelWrapper.text()).toEqual(filter.label);
    expect(customInputWrapper.exists()).toBe(true);

    customInputWrapper.trigger('change');

    expect(emit).toHaveBeenCalledTimes(2);
    const expectedEvents: XEvent[] = ['UserClickedAFilter', 'UserClickedAHierarchicalFilter'];
    expectedEvents.forEach(event => {
      expect(emit).toHaveBeenCalledWith(event, filter, {
        target: customLabelWrapper.element
      });
    });
  });

  it('allows customizing the rendered label content with an slot', () => {
    const { wrapper, filter } = renderHierarchicalFilter({
      template: `
      <HierarchicalFilter :filter="filter">
        <template #label :filter="filter">
          <span data-test="custom-label">{{ filter.label }}</span>
        </template>
      </HierarchicalFilter>
      `
    });

    const defaultButton = wrapper.find(getDataTestSelector('filter'));
    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(defaultButton.exists()).toBe(true);
    expect(customLabel.text()).toEqual(filter.label);
  });

  it('exposes proper css classes and attributes in the default slot', async () => {
    const { filterWrapper, updateFilter } = renderHierarchicalFilter({});

    expect(filterWrapper.attributes()).not.toHaveProperty('disabled');
    expect(filterWrapper.classes()).toHaveLength(2);
    expect(filterWrapper.classes()).toEqual(
      expect.arrayContaining(['x-filter', 'x-hierarchical-filter'])
    );

    await updateFilter({ selected: true });

    expect(filterWrapper.classes()).toHaveLength(4);
    expect(filterWrapper.classes()).toEqual(
      expect.arrayContaining([
        'x-filter',
        'x-filter--is-selected',
        'x-hierarchical-filter',
        'x-hierarchical-filter--is-selected'
      ])
    );

    await updateFilter({ totalResults: 0, selected: false });

    expect(filterWrapper.attributes()).toHaveProperty('disabled');
    expect(filterWrapper.classes()).toHaveLength(3);
    expect(filterWrapper.classes()).toEqual(
      expect.arrayContaining(['x-filter', 'x-hierarchical-filter', 'x-filter--is-disabled'])
    );
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { filterWrapper, updateFilter } = renderHierarchicalFilter();

    expect(filterWrapper.classes()).not.toEqual(
      expect.arrayContaining(['x-filter--is-selected', 'x-hierarchical-filter--is-selected'])
    );

    await updateFilter({ selected: true });

    expect(filterWrapper.classes()).toEqual(
      expect.arrayContaining(['x-filter--is-selected', 'x-hierarchical-filter--is-selected'])
    );
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
      const { transverseFilters } = renderHierarchicalFilter({
        filter: hierarchicalFilter,
        template: `
        <HierarchicalFilter :filter="filter" v-slot="{ filter }">
          Custom - {{ filter.label }}
        </HierarchicalFilter>`
      });

      transverseFilters((wrapper, filter) => {
        expect(wrapper.text()).toEqual(`Custom - ${filter.label}`);
      });
    });

    it('renders children filter only when available', async () => {
      const { wrapper, setFilter, transverseFilters } = renderHierarchicalFilter({
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
      const { getFilterWrappersByDepth, getFilterModelsByDepth, emit } = renderHierarchicalFilter({
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
      const { getFilterModelsByDepth, getFilterWrappersByDepth, transverseFilters } =
        renderHierarchicalFilter({
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

    it('exposes proper css classes and attributes in the default slot to children', async () => {
      const { wrapper, filter, updateFilter } = renderHierarchicalFilter({
        filter: getHierarchicalFilterStub({
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
            })
          ]
        }),
        template: `
          <HierarchicalFilter
            :filter="filter"
            v-slot="{ filter, clickFilter, cssClasses, isDisabled }"
          >
            <button
              :data-test="filter.id"
              :class="cssClasses"
              @click="clickFilter"
              :disabled="isDisabled"
            >
                {{ filter.label }}
            </button>
          </HierarchicalFilter>
        `
      });
      const childrenFilterWrapper = wrapper.find(
        getDataTestSelector(filter.children![0].id.toString())
      );

      expect(childrenFilterWrapper.attributes()).not.toHaveProperty('disabled');
      expect(childrenFilterWrapper.classes()).toHaveLength(6);
      expect(childrenFilterWrapper.classes()).toEqual(
        expect.arrayContaining([
          'x-filter',
          'x-filter--is-selected',
          'x-filter--is-partially-selected',
          'x-hierarchical-filter',
          'x-hierarchical-filter--is-selected',
          'x-hierarchical-filter--is-partially-selected'
        ])
      );

      await updateFilter({
        children: [
          Object.assign(filter.children![0], { selected: false, totalResults: 0, children: [] })
        ]
      });

      expect(childrenFilterWrapper.attributes()).toHaveProperty('disabled');
      expect(childrenFilterWrapper.classes()).toHaveLength(3);
      expect(childrenFilterWrapper.classes()).toEqual(
        expect.arrayContaining(['x-filter', 'x-hierarchical-filter', 'x-filter--is-disabled'])
      );
    });
  });
});

interface HierarchicalFilterOptions {
  template?: string;
  filter?: HierarchicalFilterModel;
}

interface HierarchicalFilterAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** The hierarchical filter wrapper.*/
  hierarchicalFilterWrapper: Wrapper<Vue>;
  /** The filter wrapper. This is the clickable element that represents the filter. */
  filterWrapper: Wrapper<Vue>;
  /** Mock for the `$x.emit` function. Can be used to check the emitted events. */
  emit: jest.Mock;
  /** The data of the rendered hierarchical filter. */
  filter: HierarchicalFilterModel;
  /**
   * Changes the rendered filter.
   *
   * @param filter - The new filter to render.
   * @returns A promise that resolves after re-rendering the component.
   */
  setFilter: (filter: HierarchicalFilterModel) => Promise<void>;
  /**
   * Clicks the root filter.
   *
   * @returns A promise that resolves after Vue updates the view.
   */
  clickFilter: () => Promise<void>;
  /**
   * Updates the rendered filter data.
   *
   * @param newFilter - The new fields to set to the rendered filter.
   * @returns A promise that resolves after Vue updates the view.
   */
  updateFilter: (newFilter: Partial<HierarchicalFilterModel>) => Promise<void>;
  /**
   * Returns a list of the filters data grouped by depth. This list is sorted using a preorder
   * algorithm.
   *
   * @returns An array that contains the groups of filter data of the distinct depths.
   */
  getFilterModelsByDepth: () => HierarchicalFilterModel[][];
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
    callback: (wrapper: Wrapper<Vue>, filter: HierarchicalFilterModel) => void
  ) => void;
}
