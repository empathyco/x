import { HierarchicalFilter as HierarchicalFilterModel } from '@empathyco/x-types-next';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { createNextHierarchicalFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
import { createNextHierarchicalFilter } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XPlugin } from '../../../../../plugins/x-plugin';
import { arrayToObject } from '../../../../../utils/array';
import { XEvent } from '../../../../../wiring/events.types';
import { facetsNextXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
import HierarchicalFilter from '../hierarchical-filter.vue';

function renderHierarchicalFilter({
  template = `<HierarchicalFilter :filter="filter" />`,
  filter = createNextHierarchicalFilter('category', 'clothing'),
  filters = [filter]
}: HierarchicalFilterOptions = {}): HierarchicalFilterAPI {
  const [, localVue] = installNewXPlugin({ initialXModules: [facetsNextXModule] });
  const emit = jest.spyOn(XPlugin.bus, 'emit');
  const store = XPlugin.store;
  resetXFacetsStateWith(store, { filters: arrayToObject(filters, 'id') });
  const wrapper = mount(
    {
      components: { HierarchicalFilter },
      template,
      props: ['filterId'],
      computed: {
        filter(this: typeof Vue & { filterId: HierarchicalFilterModel['id'] }) {
          return store.state.x.facetsNext.filters[this.filterId];
        }
      }
    },
    {
      store,
      localVue,
      propsData: {
        filterId: filter.id
      }
    }
  );

  const filterWrapper = wrapper.find(getDataTestSelector('filter'));
  const hierarchicalFilterWrapper = wrapper.findComponent(HierarchicalFilter);

  async function setFilter(filter: HierarchicalFilterModel): Promise<void> {
    store.commit('x/facetsNext/setFilter', filter);
    await localVue.nextTick();
  }

  async function setRootFilter(newFilter: HierarchicalFilterModel): Promise<void> {
    filter = newFilter;
    await setFilter(newFilter);
    wrapper.setProps({ filterId: filter.id });
  }

  async function clickFilter(): Promise<void> {
    await filterWrapper.trigger('click');
  }

  function updateFilter(newFields: Partial<HierarchicalFilterModel>): Promise<void> {
    setFilter({ ...filter, ...newFields });
    return localVue.nextTick();
  }

  function getFilters(filterIds: Array<HierarchicalFilterModel['id']>): HierarchicalFilterModel[] {
    return filterIds.map(
      filterId => store.state.x.facetsNext.filters[filterId]
    ) as HierarchicalFilterModel[];
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
        getFilterModels(getFilters(childFilter.children ?? []), depth + 1, accumulator);
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
    setRootFilter,
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

    expect(getXComponentXModuleName(hierarchicalFilterWrapper.vm)).toEqual('facetsNext');
  });

  it('renders the provided filter by default', () => {
    const { wrapper, filter } = renderHierarchicalFilter();

    expect(wrapper.text()).toEqual(filter.label);
  });

  it('emits `UserClickedAFilter` and `UserClickedAHierarchicalFilter` event when clicked', () => {
    const { filterWrapper, clickFilter, emit, filter } = renderHierarchicalFilter();

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith('UserClickedANextFilter', filter, {
      target: filterWrapper.element,
      moduleName: 'facetsNext'
    });
    expect(emit).toHaveBeenCalledWith('UserClickedANextHierarchicalFilter', filter, {
      target: filterWrapper.element,
      moduleName: 'facetsNext'
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
    const expectedEvents: XEvent[] = [
      'UserClickedANextFilter',
      'UserClickedANextHierarchicalFilter'
    ];
    expectedEvents.forEach(event => {
      expect(emit).toHaveBeenCalledWith(event, filter, {
        target: customLabelWrapper.element,
        moduleName: 'facetsNext'
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
    const { filterWrapper, updateFilter } = renderHierarchicalFilter();

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
    const createHierarchicalFilters = (): HierarchicalFilterModel[] =>
      createNextHierarchicalFacetStub('hierarchical', createFilter => [
        ...createFilter('root', false, createFilter => [
          // Partially selected
          ...createFilter('child-0', true, createFilter => [
            // Partially selected
            ...createFilter('grand-child-0', false), // Unselected
            ...createFilter('grand-child-1', true) // Selected
          ]),
          ...createFilter('child-1', false) // Unselected
        ])
      ]).filters;

    it('allows customizing the slot for all the children', () => {
      const hierarchicalFilters = createHierarchicalFilters();
      const { transverseFilters } = renderHierarchicalFilter({
        filter: hierarchicalFilters[0],
        filters: hierarchicalFilters,
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
      const hierarchicalFilters = createHierarchicalFilters();
      const initialFilter = createNextHierarchicalFilter('category', 'drinks');
      const { wrapper, setRootFilter, transverseFilters } = renderHierarchicalFilter({
        filter: initialFilter,
        filters: [initialFilter, ...hierarchicalFilters]
      });

      const childrenFiltersWrapper = wrapper.find(getDataTestSelector('children-filters'));
      expect(childrenFiltersWrapper.element).toBeUndefined();

      await setRootFilter(hierarchicalFilters[0]);

      transverseFilters((wrapper, filter) => {
        expect(wrapper.text()).toEqual(filter.label);
      });
    });

    // eslint-disable-next-line max-len
    it('emits `UserClickedAFilter` and `UserClickedAHierarchicalFilter` events when a child is clicked', () => {
      const hierarchicalFilters = createHierarchicalFilters();
      const { getFilterWrappersByDepth, getFilterModelsByDepth, emit } = renderHierarchicalFilter({
        filter: hierarchicalFilters[0],
        filters: hierarchicalFilters
      });

      const [, , [nestedFilterData]] = getFilterModelsByDepth();
      const [, , [nestedFilterWrapper]] = getFilterWrappersByDepth();
      nestedFilterWrapper.trigger('click');

      expect(emit).toHaveBeenCalledTimes(2);
      expect(emit).toHaveBeenCalledWith('UserClickedANextFilter', nestedFilterData, {
        target: nestedFilterWrapper.element,
        moduleName: 'facetsNext'
      });
      expect(emit).toHaveBeenCalledWith('UserClickedANextHierarchicalFilter', nestedFilterData, {
        target: nestedFilterWrapper.element,
        moduleName: 'facetsNext'
      });
    });

    it('adds a CSS class when the filter is partially selected', async () => {
      const hierarchicalFilters = createHierarchicalFilters();
      const { getFilterModelsByDepth, getFilterWrappersByDepth, transverseFilters } =
        renderHierarchicalFilter({
          filter: hierarchicalFilters[0],
          filters: hierarchicalFilters
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
        expect(filterWrapper.classes()).toContain('x-hierarchical-filter--is-partially-selected');
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
      const hierarchicalFilters = createHierarchicalFilters();
      const { wrapper, setFilter } = renderHierarchicalFilter({
        filter: hierarchicalFilters[0],
        filters: hierarchicalFilters,
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
      const firstChildFilter = hierarchicalFilters[1];
      const childrenFilterWrapper = wrapper.find(
        getDataTestSelector(firstChildFilter.id.toString())
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

      await setFilter({ ...firstChildFilter, selected: false, totalResults: 0, children: [] });

      expect(childrenFilterWrapper.attributes()).toHaveProperty('disabled');
      expect(childrenFilterWrapper.classes()).toHaveLength(3);
      expect(childrenFilterWrapper.classes()).toEqual(
        expect.arrayContaining(['x-filter', 'x-hierarchical-filter', 'x-filter--is-disabled'])
      );
    });
  });
});

interface HierarchicalFilterOptions {
  filter?: HierarchicalFilterModel;
  filters?: HierarchicalFilterModel[];
  template?: string;
}

interface HierarchicalFilterAPI {
  /**
   * Clicks the root filter.
   *
   * @returns A promise that resolves after Vue updates the view.
   */
  clickFilter: () => Promise<void>;
  /** Mock for the `$x.emit` function. Can be used to check the emitted events. */
  emit: jest.SpyInstance;
  /** The data of the rendered hierarchical filter. */
  filter: HierarchicalFilterModel;
  /** The filter wrapper. This is the clickable element that represents the filter. */
  filterWrapper: Wrapper<Vue>;
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
  /** The hierarchical filter wrapper.*/
  hierarchicalFilterWrapper: Wrapper<Vue>;
  /**
   * Changes the rendered filter.
   *
   * @param filter - The new filter to render.
   * @returns A promise that resolves after re-rendering the component.
   */
  setRootFilter: (filter: HierarchicalFilterModel) => Promise<void>;
  /**
   * Saves a new filter in the store.
   *
   * @param filter - The filter to save in the store.
   * @returns A promise that resolves after re-rendering the component.
   */
  setFilter: (filter: HierarchicalFilterModel) => Promise<void>;
  /**
   * Transverse the filters using a preorder algorithm.
   *
   * @param callback - A callback does perform actions with the filter wrapper and the filter data.
   * For example, it can run some assertions.
   */
  transverseFilters: (
    callback: (wrapper: Wrapper<Vue>, filter: HierarchicalFilterModel) => void
  ) => void;
  /**
   * Updates the rendered filter data.
   *
   * @param newFilter - The new fields to set to the rendered filter.
   * @returns A promise that resolves after Vue updates the view.
   */
  updateFilter: (newFilter: Partial<HierarchicalFilterModel>) => Promise<void>;
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
}
