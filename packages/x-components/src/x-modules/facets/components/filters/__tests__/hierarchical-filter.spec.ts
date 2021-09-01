import { HierarchicalFilter as HierarchicalFilterModel } from '@empathyco/x-types';
import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { createHierarchicalFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XPlugin } from '../../../../../plugins/x-plugin';
import { facetsXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
import HierarchicalFilter from '../hierarchical-filter.vue';

function renderHierarchicalFilter({
  template = `<HierarchicalFilter :filter="filter" />`
}: HierarchicalFilterOptions = {}): HierarchicalFilterAPI {
  const facet = createHierarchicalFacetStub('category', createFilter => [
    // Partially selected
    ...createFilter('root', false, createFilter => [
      // Partially selected
      ...createFilter('child-0', true, createFilter => [
        ...createFilter('grand-child-0', false), // Unselected
        ...createFilter('grand-child-1', true) // Selected
      ]),
      ...createFilter('child-1', false) // Unselected
    ])
  ]);

  const [, localVue] = installNewXPlugin({ initialXModules: [facetsXModule] });
  const emit = jest.spyOn(XPlugin.bus, 'emit');
  const store = XPlugin.store;
  resetXFacetsStateWith(store, { category: facet });
  const wrapper = mount(
    {
      components: { HierarchicalFilter },
      template,
      computed: {
        filter() {
          return store.state.x.facets.filters['category:root'];
        }
      }
    },
    {
      store,
      localVue
    }
  );

  const hierarchicalFilterWrapper = wrapper.findComponent(HierarchicalFilter);

  const getFilterWrapper = (): Wrapper<Vue> =>
    hierarchicalFilterWrapper.find(getDataTestSelector('filter'));

  const getFiltersWrappers = (): WrapperArray<Vue> =>
    hierarchicalFilterWrapper.findAll(getDataTestSelector('filter'));

  async function setFilter(filter: HierarchicalFilterModel): Promise<void> {
    store.commit('x/facets/setFilter', filter);
    await localVue.nextTick();
  }

  async function clickFilter(): Promise<void> {
    await getFilterWrapper().trigger('click');
  }

  function getFilters(): HierarchicalFilterModel[] {
    return store.getters['x/facets/facets'][facet.id].filters;
  }

  function getRootFilter(): HierarchicalFilterModel {
    return getFilters().find(filter => filter.parentId === null)!;
  }

  function getPartiallySelectedFilters(): HierarchicalFilterModel[] {
    return getFilters().filter(filter =>
      ['category:root', 'category:child-0'].includes(String(filter.id))
    );
  }

  return {
    getFilterWrapper,
    getFiltersWrappers,
    hierarchicalFilterWrapper,
    emit,
    getRootFilter,
    getFilters,
    getPartiallySelectedFilters,
    setFilter,
    clickFilter
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
    const { getFilterWrapper, getRootFilter } = renderHierarchicalFilter();

    expect(getFilterWrapper().text()).toEqual(getRootFilter().label);
  });

  it('emits `UserClickedAFilter` and `UserClickedAHierarchicalFilter` event when clicked', () => {
    const { getFilterWrapper, clickFilter, emit, getRootFilter } = renderHierarchicalFilter();
    const filter = getRootFilter();
    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter, {
      target: getFilterWrapper().element,
      moduleName: 'facets'
    });
    expect(emit).toHaveBeenCalledWith('UserClickedAHierarchicalFilter', filter, {
      target: getFilterWrapper().element,
      moduleName: 'facets'
    });
  });

  it('allows replacing the root element of the component', () => {
    const { hierarchicalFilterWrapper, getRootFilter, emit } = renderHierarchicalFilter({
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

    const filter = getRootFilter();
    const customLabelWrapper = hierarchicalFilterWrapper.find(getDataTestSelector('custom-label'));
    const customInputWrapper = hierarchicalFilterWrapper.find(getDataTestSelector('custom-input'));
    expect(customLabelWrapper.text()).toEqual(filter.label);
    expect(customInputWrapper.exists()).toBe(true);

    customInputWrapper.trigger('change');

    expect(emit).toHaveBeenCalledTimes(2);
    const expectedMetadata = {
      target: customLabelWrapper.element,
      moduleName: 'facets'
    };
    expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter, expectedMetadata);
    expect(emit).toHaveBeenCalledWith('UserClickedAHierarchicalFilter', filter, expectedMetadata);
  });

  it('allows customizing the rendered label content with an slot', () => {
    const { getFilterWrapper, getRootFilter } = renderHierarchicalFilter({
      template: `
        <HierarchicalFilter :filter="filter">
          <template #label :filter="filter">
            <span data-test="custom-label">{{ filter.label }}</span>
          </template>
        </HierarchicalFilter>
      `
    });

    const defaultButton = getFilterWrapper().find(getDataTestSelector('filter'));
    const customLabel = getFilterWrapper().find(getDataTestSelector('custom-label'));
    expect(defaultButton.exists()).toBe(true);
    expect(customLabel.text()).toEqual(getRootFilter().label);
  });

  it('exposes proper css classes and attributes in the default slot', async () => {
    const { getFilterWrapper, setFilter, getRootFilter } = renderHierarchicalFilter();

    expect(getFilterWrapper().attributes()).not.toHaveProperty('disabled');
    expect(getFilterWrapper().classes()).toHaveLength(4);
    expect(getFilterWrapper().classes()).toEqual(
      expect.arrayContaining([
        'x-filter',
        'x-hierarchical-filter',
        'x-hierarchical-filter--is-partially-selected',
        'x-filter--is-partially-selected'
      ])
    );

    const filter = getRootFilter();
    await setFilter({ ...filter, selected: true });

    expect(getFilterWrapper().classes()).toHaveLength(6);
    expect(getFilterWrapper().classes()).toEqual(
      expect.arrayContaining([
        'x-filter',
        'x-filter--is-selected',
        'x-hierarchical-filter',
        'x-hierarchical-filter--is-selected',
        'x-hierarchical-filter--is-partially-selected',
        'x-filter--is-partially-selected'
      ])
    );

    await setFilter({ ...filter, totalResults: 0, selected: false });

    expect(getFilterWrapper().attributes()).toHaveProperty('disabled');
    expect(getFilterWrapper().classes()).toHaveLength(5);
    expect(getFilterWrapper().classes()).toEqual(
      expect.arrayContaining([
        'x-filter',
        'x-hierarchical-filter',
        'x-filter--is-disabled',
        'x-hierarchical-filter--is-partially-selected',
        'x-filter--is-partially-selected'
      ])
    );
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { getFilterWrapper, setFilter, getRootFilter } = renderHierarchicalFilter();

    expect(getFilterWrapper().classes()).not.toEqual(
      expect.arrayContaining(['x-filter--is-selected', 'x-hierarchical-filter--is-selected'])
    );

    const filter = getRootFilter();
    await setFilter({ ...filter, selected: true });

    expect(getFilterWrapper().classes()).toEqual(
      expect.arrayContaining(['x-filter--is-selected', 'x-hierarchical-filter--is-selected'])
    );
  });

  describe('children testing', () => {
    it('allows customizing the slot for all the children', () => {
      const { getFiltersWrappers, getFilters } = renderHierarchicalFilter({
        template: `
          <HierarchicalFilter :filter="filter" #label="{ filter }">
            Custom - {{ filter.label }}
          </HierarchicalFilter>`
      });

      const numberOfFilters = getFilters().length;
      expect(getFiltersWrappers()).toHaveLength(numberOfFilters);
      getFiltersWrappers().wrappers.forEach(filterWrapper => {
        const filterLabel: string = (filterWrapper.vm as any).filter.label;
        expect(filterWrapper.text()).toContain(`Custom - ${filterLabel}`);
      });
    });

    it('renders children filter only when available', async () => {
      const { hierarchicalFilterWrapper, getFiltersWrappers, setFilter, getRootFilter } =
        renderHierarchicalFilter();
      const filter = getRootFilter();
      await setFilter({ ...filter, children: [] });
      const childrenFiltersWrapper = hierarchicalFilterWrapper.find(
        getDataTestSelector('children-filters')
      );

      expect(childrenFiltersWrapper.element).toBeUndefined();
      expect(getFiltersWrappers().wrappers).toHaveLength(1);
      getFiltersWrappers().wrappers.forEach(filterWrapper =>
        expect(filterWrapper.text()).toEqual(filter.label)
      );
    });

    // eslint-disable-next-line max-len
    it('emits `UserClickedAFilter` and `UserClickedAHierarchicalFilter` events when a child is clicked', () => {
      const { getFiltersWrappers, emit } = renderHierarchicalFilter();
      expect(getFiltersWrappers().wrappers.length).toBeGreaterThan(1);
      getFiltersWrappers().wrappers.forEach(filterWrapper => {
        emit.mockClear();
        filterWrapper.trigger('click');
        const filter = (filterWrapper.vm as any).filter;

        expect(emit).toHaveBeenCalledTimes(2);
        expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter, {
          target: filterWrapper.element,
          moduleName: 'facets'
        });
        expect(emit).toHaveBeenCalledWith('UserClickedAHierarchicalFilter', filter, {
          target: filterWrapper.element,
          moduleName: 'facets'
        });
      });
    });

    it('adds a CSS class when the filter is partially selected', () => {
      const { getFiltersWrappers, getPartiallySelectedFilters } = renderHierarchicalFilter();
      const partiallySelectedIds = getPartiallySelectedFilters().map(filter => filter.id);

      expect(getFiltersWrappers().length).toBeGreaterThan(0);

      getFiltersWrappers().wrappers.forEach(filterWrapper => {
        const filter = (filterWrapper.vm as any).filter;
        if (partiallySelectedIds.includes(filter.id)) {
          expect(filterWrapper.classes()).toContain('x-hierarchical-filter--is-partially-selected');
        } else {
          expect(filterWrapper.classes()).not.toContain(
            'x-hierarchical-filter--is-partially-selected'
          );
        }
      });
    });

    it('exposes proper css classes and attributes in the default slot to children', () => {
      const { setFilter, getFiltersWrappers } = renderHierarchicalFilter({
        template: `
           <HierarchicalFilter
             :filter="filter"
             v-slot="{ filter, clickFilter, cssClasses, isDisabled }"
             >
               <button
               data-test="filter"
               :class="cssClasses"
               @click="clickFilter"
               :disabled="isDisabled"
               >
                 {{ filter.label }}
               </button>
           </HierarchicalFilter>
     `
      });
      const filtersWrappers = getFiltersWrappers();

      expect(filtersWrappers.length).toBeGreaterThan(1);

      filtersWrappers.wrappers.forEach(async filterWrapper => {
        const filter = (filterWrapper.vm as any).filter;

        expect(filterWrapper.attributes()).not.toHaveProperty('disabled');
        expect(filterWrapper.classes()).toHaveLength(6);
        expect(filterWrapper.classes()).toEqual(
          expect.arrayContaining([
            'x-filter',
            'x-filter--is-selected',
            'x-filter--is-partially-selected',
            'x-hierarchical-filter',
            'x-hierarchical-filter--is-selected',
            'x-hierarchical-filter--is-partially-selected'
          ])
        );

        await setFilter({ ...filter, selected: false, totalResults: 0, children: [] });

        expect(filterWrapper.attributes()).toHaveProperty('disabled');
        expect(filterWrapper.classes()).toHaveLength(3);
        expect(filterWrapper.classes()).toEqual(
          expect.arrayContaining(['x-filter', 'x-hierarchical-filter', 'x-filter--is-disabled'])
        );
      });
    });
  });
});

interface HierarchicalFilterOptions {
  filter?: HierarchicalFilterModel;
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
  /**
   * Get the filter wrapper. This is the clickable element that represents the filter.
   *
   * @returns The filter Wrapper.
   */
  getFilterWrapper: () => Wrapper<Vue>;
  /**
   * Get all the filters including children.
   *
   * @returns The filters WrapperArray.
   */
  getFiltersWrappers: () => WrapperArray<Vue>;
  /** The hierarchical filter wrapper.*/
  hierarchicalFilterWrapper: Wrapper<Vue>;
  /**
   * Returns the root filter.
   *
   * @returns The root filter.
   */
  getRootFilter: () => HierarchicalFilterModel;
  /**
   * Saves a new filter in the store.
   *
   * @param filter - The filter to save in the store.
   * @returns A promise that resolves after re-rendering the component.
   */
  setFilter: (filter: HierarchicalFilterModel) => Promise<void>;
  /**
   * Returns all the filters of the hierarchical facet.
   *
   * @returns All the filters of the hierarchical facet.
   */
  getFilters: () => HierarchicalFilterModel[];
  /**
   * Returns all the partially selected filters of the hierarchical facet.
   *
   * @returns All the partially selected filters of the hierarchical facet.
   */
  getPartiallySelectedFilters: () => HierarchicalFilterModel[];
}
