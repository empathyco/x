import { HierarchicalFilter as HierarchicalFilterModel } from '@empathyco/x-types';
import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { createHierarchicalFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XPlugin } from '../../../../../plugins/x-plugin';
import { XEventsTypes } from '../../../../../wiring/events.types';
import { flatHierarchicalFilters } from '../../../utils';
import { facetsXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
import HierarchicalFilter from '../hierarchical-filter.vue';

function renderHierarchicalFilter({
  template = `<HierarchicalFilter :filter="filter" :clickEvents="clickEvents" />`,
  clickEvents
}: HierarchicalFilterOptions = {}): HierarchicalFilterAPI {
  const facet = createHierarchicalFacetStub('category', createFilter => [
    // Partially selected
    createFilter('root', false, createFilter => [
      // Partially selected
      createFilter('child-0', true, createFilter => [
        createFilter('grand-child-0', false), // Unselected
        createFilter('grand-child-1', true) // Selected
      ]),
      createFilter('child-1', false) // Unselected
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
        },
        clickEvents() {
          return clickEvents;
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

  async function mutateFilter(
    filter: HierarchicalFilterModel,
    newFilterState: Partial<HierarchicalFilterModel>
  ): Promise<void> {
    store.commit('x/facets/mutateFilter', { filter, newFilterState });
    await localVue.nextTick();
  }

  async function clickFilter(): Promise<void> {
    await getFilterWrapper().trigger('click');
  }

  function getFilters(): HierarchicalFilterModel[] {
    return flatHierarchicalFilters(store.getters['x/facets/facets'][facet.id].filters);
  }

  function getRootFilter(): HierarchicalFilterModel {
    return getFilters().find(filter => filter.parentId === null)!;
  }

  function getPartiallySelectedFilters(): HierarchicalFilterModel[] {
    return getFilters().filter(filter =>
      ['category:root', 'category:child-0'].includes(String(filter.id))
    );
  }

  function getFilterWrapperByText(text: string): Wrapper<Vue> | undefined {
    return getFiltersWrappers().wrappers.find(filter => filter.text().trim() === text);
  }

  return {
    getFilterWrapper,
    getFiltersWrappers,
    getFilterWrapperByText,
    hierarchicalFilterWrapper,
    emit,
    getRootFilter,
    getFilters,
    getPartiallySelectedFilters,
    mutateFilter,
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

  it('emits configured events when clicked', () => {
    const { getFilterWrapper, clickFilter, emit, getRootFilter } = renderHierarchicalFilter({
      clickEvents: {
        UserAcceptedAQuery: 'potato',
        UserBlurredSearchBox: undefined
      }
    });
    const filter = getRootFilter();
    clickFilter();

    expect(emit).toHaveBeenCalledTimes(4);
    ['UserClickedAFilter', 'UserClickedAHierarchicalFilter'].forEach(event => {
      expect(emit).toHaveBeenCalledWith(event, filter, {
        target: getFilterWrapper().element,
        moduleName: 'facets'
      });
    });
    expect(emit).toHaveBeenCalledWith('UserAcceptedAQuery', 'potato', {
      target: getFilterWrapper().element,
      moduleName: 'facets'
    });
    expect(emit).toHaveBeenCalledWith('UserBlurredSearchBox', undefined, {
      target: getFilterWrapper().element,
      moduleName: 'facets'
    });
  });

  it('allows replacing the root element of the component', () => {
    const { hierarchicalFilterWrapper, getRootFilter, emit } = renderHierarchicalFilter({
      template: `
        <HierarchicalFilter
          :filter="filter"
          :clickEvents="clickEvents"
          v-slot="{ filter, clickFilter }"
          >
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
        <HierarchicalFilter :filter="filter" :clickEvents="clickEvents">
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
    const { getFilterWrapper, mutateFilter, getRootFilter } = renderHierarchicalFilter();

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
    await mutateFilter(filter, { selected: true });

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

    await mutateFilter(filter, { totalResults: 0, selected: false });

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
    const { getFilterWrapper, mutateFilter, getRootFilter } = renderHierarchicalFilter();

    expect(getFilterWrapper().classes()).not.toEqual(
      expect.arrayContaining(['x-filter--is-selected', 'x-hierarchical-filter--is-selected'])
    );

    const filter = getRootFilter();
    await mutateFilter(filter, { selected: true });

    expect(getFilterWrapper().classes()).toEqual(
      expect.arrayContaining(['x-filter--is-selected', 'x-hierarchical-filter--is-selected'])
    );
  });

  describe('children testing', () => {
    it('allows customizing the slot for all the children', () => {
      const { getFiltersWrappers, getFilters } = renderHierarchicalFilter({
        template: `
          <HierarchicalFilter :filter="filter" :clickEvents="clickEvents" #label="{ filter }">
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
      const { hierarchicalFilterWrapper, getFiltersWrappers, mutateFilter, getRootFilter } =
        renderHierarchicalFilter();
      const filter = getRootFilter();
      await mutateFilter(filter, { children: [] });
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

    it('emits configured events when a child is clicked', () => {
      const { getFiltersWrappers, emit } = renderHierarchicalFilter({
        clickEvents: {
          UserAcceptedAQuery: 'potato',
          UserBlurredSearchBox: undefined
        }
      });
      expect(getFiltersWrappers().wrappers.length).toBeGreaterThan(1);
      getFiltersWrappers().wrappers.forEach(filterWrapper => {
        emit.mockClear();
        filterWrapper.trigger('click');
        const filter = (filterWrapper.vm as any).filter;

        expect(emit).toHaveBeenCalledTimes(4);
        ['UserClickedAFilter', 'UserClickedAHierarchicalFilter'].forEach(event => {
          expect(emit).toHaveBeenCalledWith(event, filter, {
            target: filterWrapper.element,
            moduleName: 'facets'
          });
        });
        expect(emit).toHaveBeenCalledWith('UserAcceptedAQuery', 'potato', {
          target: filterWrapper.element,
          moduleName: 'facets'
        });
        expect(emit).toHaveBeenCalledWith('UserBlurredSearchBox', undefined, {
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

    it('exposes proper css classes and attributes in the default slot to children', async () => {
      const { mutateFilter, getFilterWrapperByText, getFilters } = renderHierarchicalFilter({
        template: `
           <HierarchicalFilter
             :filter="filter"
             :clickEvents="clickEvents"
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

      const grandChild0Wrapper = getFilterWrapperByText('grand-child-0')!;
      const grandChild0Data = getFilters()[2];
      expect(grandChild0Wrapper.classes()).toHaveLength(2);
      expect(grandChild0Wrapper.classes()).toEqual(
        expect.arrayContaining(['x-filter', 'x-hierarchical-filter'])
      );

      /* Filters with totalResults===0 should be disabled. */
      await mutateFilter(grandChild0Data, { totalResults: 0 });
      expect(grandChild0Wrapper.attributes()).toHaveProperty('disabled');
      expect(grandChild0Wrapper.classes()).toHaveLength(3);
      expect(grandChild0Wrapper.classes()).toEqual(
        expect.arrayContaining(['x-filter', 'x-hierarchical-filter', 'x-filter--is-disabled'])
      );

      /* As grand-child-0 is deselected and grand-child-1 selected, child-0 should have partial
       * select classes. As it is selected it should have selected classes
       */
      const child0Wrapper = getFilterWrapperByText('child-0')!;
      expect(child0Wrapper.attributes()).not.toHaveProperty('disabled');
      expect(child0Wrapper.classes()).toHaveLength(6);
      expect(child0Wrapper.classes()).toEqual(
        expect.arrayContaining([
          'x-filter',
          'x-filter--is-selected',
          'x-filter--is-partially-selected',
          'x-hierarchical-filter',
          'x-hierarchical-filter--is-selected',
          'x-hierarchical-filter--is-partially-selected'
        ])
      );

      // Enable back filter through total results and select it
      await mutateFilter(grandChild0Data, { totalResults: 1, selected: true });
      expect(grandChild0Wrapper.attributes()).not.toHaveProperty('disabled');
      expect(grandChild0Wrapper.classes()).toHaveLength(4);
      expect(grandChild0Wrapper.classes()).toEqual(
        expect.arrayContaining([
          'x-filter',
          'x-hierarchical-filter',
          'x-filter--is-selected',
          'x-hierarchical-filter--is-selected'
        ])
      );
      // Child 0 Partial classes should be removed as grand-child is now selected
      expect(child0Wrapper.classes()).toHaveLength(4);
      expect(child0Wrapper.classes()).toEqual(
        expect.arrayContaining([
          'x-filter',
          'x-filter--is-selected',
          'x-hierarchical-filter',
          'x-hierarchical-filter--is-selected'
        ])
      );
    });
  });
});

interface HierarchicalFilterOptions {
  clickEvents?: Partial<XEventsTypes>;
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
   * Gets a filter wrapper by the rendered button text.
   *
   * @param text - The rendered filter text.
   * @returns The filter Wrapper.
   */
  getFilterWrapperByText: (text: string) => Wrapper<Vue> | undefined;
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
  mutateFilter: (
    filter: HierarchicalFilterModel,
    newFilterState: Partial<HierarchicalFilterModel>
  ) => Promise<void>;
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
