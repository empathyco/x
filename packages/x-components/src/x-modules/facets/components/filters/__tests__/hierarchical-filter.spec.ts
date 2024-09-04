import { HierarchicalFilter as HierarchicalFilterModel } from '@empathyco/x-types';
import { DOMWrapper, mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Store } from 'vuex';
import { createHierarchicalFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XPlugin } from '../../../../../plugins/x-plugin';
import { flatHierarchicalFilters } from '../../../utils';
import { facetsXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
import HierarchicalFilter from '../hierarchical-filter.vue';
import { RootXStoreState } from '../../../../../store/index';

const metadata = {
  moduleName: 'facets',
  location: 'none',
  replaceable: true
};

function render({
  template = `
    <HierarchicalFilter
      :filter="filter"
      :clickEvents="clickEvents"
      :childrenFiltersClass="childrenFiltersClass"
      :filterItemClass="filterItemClass"
      />`,
  facet = createHierarchicalFacetStub('category', createFilter => [
    // Partially selected
    createFilter('root', false, createFilter => [
      // Partially selected
      createFilter('child-0', true, createFilter => [
        createFilter('grand-child-0', false), // Unselected
        createFilter('grand-child-1', true) // Selected
      ]),
      createFilter('child-1', false) // Unselected
    ])
  ]),
  childrenFiltersClass = '',
  filterItemClass = '',
  clickEvents = {}
} = {}) {
  const store = new Store<RootXStoreState>({});
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
      },
      data() {
        return {
          childrenFiltersClass,
          filterItemClass
        };
      }
    },
    {
      store,
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [facetsXModule] })]
      }
    }
  );
  resetXFacetsStateWith(store, { category: facet });

  const hierarchicalFilterWrapper = wrapper.findComponent(HierarchicalFilter);

  const getFilterWrapper = (): DOMWrapper<Element> =>
    hierarchicalFilterWrapper.find(getDataTestSelector('filter'));

  const getFiltersWrappers = (): DOMWrapper<Element>[] =>
    hierarchicalFilterWrapper.findAll(getDataTestSelector('filter'));

  async function mutateFilter(
    filter: HierarchicalFilterModel,
    newFilterState: Partial<HierarchicalFilterModel>
  ): Promise<void> {
    store.commit('x/facets/mutateFilter', { filter, newFilterState });
    await nextTick();
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

  function getFilterWrapperByText(text: string): DOMWrapper<Element> | undefined {
    return getFiltersWrappers().find(filter => filter.text().trim() === text);
  }

  return {
    getFilterWrapper,
    getFiltersWrappers,
    getFilterWrapperByText,
    hierarchicalFilterWrapper,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    getRootFilter,
    getFilters,
    getPartiallySelectedFilters,
    mutateFilter,
    clickFilter
  };
}

describe('testing `HierarchicalFilter` component', () => {
  it('is an XComponent that belongs to the facets', () => {
    const { hierarchicalFilterWrapper } = render();

    expect(isXComponent(hierarchicalFilterWrapper.vm)).toBeTruthy();
    expect(getXComponentXModuleName(hierarchicalFilterWrapper.vm)).toEqual('facets');
  });

  it('renders the provided filter by default', () => {
    const { getFilterWrapper, getRootFilter } = render();

    expect(getFilterWrapper().text()).toEqual(getRootFilter().label);
  });

  it('emits `UserClickedAFilter` and `UserClickedAHierarchicalFilter` event when clicked', () => {
    const { clickFilter, emitSpy, getRootFilter } = render();
    const filter = getRootFilter();
    clickFilter();

    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenCalledWith('UserClickedAFilter', filter, metadata);
    expect(emitSpy).toHaveBeenCalledWith('UserClickedAHierarchicalFilter', filter, metadata);
  });

  it('emits configured events when clicked', () => {
    const { clickFilter, emitSpy, getRootFilter } = render({
      clickEvents: {
        UserAcceptedAQuery: 'potato',
        UserBlurredSearchBox: undefined
      }
    });
    const filter = getRootFilter();
    clickFilter();

    expect(emitSpy).toHaveBeenCalledTimes(4);
    ['UserClickedAFilter', 'UserClickedAHierarchicalFilter'].forEach(event => {
      expect(emitSpy).toHaveBeenCalledWith(event, filter, metadata);
    });
    expect(emitSpy).toHaveBeenCalledWith('UserAcceptedAQuery', 'potato', metadata);
    expect(emitSpy).toHaveBeenCalledWith('UserBlurredSearchBox', undefined, metadata);
  });

  it('allows replacing the root element of the component', () => {
    const { hierarchicalFilterWrapper, getRootFilter, emitSpy } = render({
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
        </HierarchicalFilter>`
    });

    const filter = getRootFilter();
    const customLabelWrapper = hierarchicalFilterWrapper.find(getDataTestSelector('custom-label'));
    const customInputWrapper = hierarchicalFilterWrapper.find(getDataTestSelector('custom-input'));
    expect(customLabelWrapper.text()).toEqual(filter.label);
    expect(customInputWrapper.exists()).toBe(true);

    customInputWrapper.trigger('change');

    expect(emitSpy).toHaveBeenCalledTimes(2);

    expect(emitSpy).toHaveBeenCalledWith('UserClickedAFilter', filter, metadata);
    expect(emitSpy).toHaveBeenCalledWith('UserClickedAHierarchicalFilter', filter, metadata);
  });

  it('allows customizing the rendered label content with an slot', () => {
    const { getFilterWrapper, getRootFilter } = render({
      template: `
        <HierarchicalFilter :filter="filter" :clickEvents="clickEvents">
          <template #label :filter="filter">
            <span data-test="custom-label">{{ filter.label }}</span>
          </template>
        </HierarchicalFilter>`
    });

    const defaultButton = getFilterWrapper().find(getDataTestSelector('filter'));
    const customLabel = getFilterWrapper().find(getDataTestSelector('custom-label'));
    expect(defaultButton.exists()).toBe(true);
    expect(customLabel.text()).toEqual(getRootFilter().label);
  });

  it('exposes proper css classes and attributes in the default slot', async () => {
    const { getFilterWrapper, mutateFilter, getRootFilter } = render();

    expect(getFilterWrapper().attributes()).not.toHaveProperty('disabled');
    expect(getFilterWrapper().classes()).toHaveLength(4);
    expect(getFilterWrapper().classes()).toEqual(
      expect.arrayContaining([
        'x-facet-filter',
        'x-hierarchical-filter',
        'x-hierarchical-filter--is-partially-selected',
        'x-facet-filter--is-partially-selected'
      ])
    );

    const filter = getRootFilter();
    await mutateFilter(filter, { selected: true });

    expect(getFilterWrapper().classes()).toHaveLength(6);
    expect(getFilterWrapper().classes()).toEqual(
      expect.arrayContaining([
        'x-facet-filter',
        'x-selected',
        'x-hierarchical-filter',
        'x-hierarchical-filter--is-selected',
        'x-hierarchical-filter--is-partially-selected',
        'x-facet-filter--is-partially-selected'
      ])
    );

    await mutateFilter(filter, { totalResults: 0, selected: false });

    expect(getFilterWrapper().attributes()).toHaveProperty('disabled');
    expect(getFilterWrapper().classes()).toHaveLength(4);
    expect(getFilterWrapper().classes()).toEqual(
      expect.arrayContaining([
        'x-facet-filter',
        'x-hierarchical-filter',
        'x-hierarchical-filter--is-partially-selected',
        'x-facet-filter--is-partially-selected'
      ])
    );
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { getFilterWrapper, mutateFilter, getRootFilter } = render();

    expect(getFilterWrapper().classes()).not.toEqual(
      expect.arrayContaining(['x-selected', 'x-hierarchical-filter--is-selected'])
    );

    const filter = getRootFilter();
    await mutateFilter(filter, { selected: true });

    expect(getFilterWrapper().classes()).toEqual(
      expect.arrayContaining(['x-selected', 'x-hierarchical-filter--is-selected'])
    );
  });

  describe('children testing', () => {
    it('allows customizing the slot for all the children', () => {
      const { getFiltersWrappers, getFilters } = render({
        template: `
          <HierarchicalFilter :filter="filter" :clickEvents="clickEvents" #label="{ filter }">
            Custom - {{ filter.label }}
          </HierarchicalFilter>`
      });

      const numberOfFilters = getFilters().length;
      expect(getFiltersWrappers()).toHaveLength(numberOfFilters);
      getFiltersWrappers().forEach(filterWrapper => {
        const filterLabel: string = (filterWrapper as any).filter.label;
        expect(filterWrapper.text()).toContain(`Custom - ${filterLabel}`);
      });
    });

    it('renders children filter only when available', async () => {
      const { hierarchicalFilterWrapper, getFiltersWrappers, mutateFilter, getRootFilter } =
        render();
      const filter = getRootFilter();
      await mutateFilter(filter, { children: [] });
      const childrenFiltersWrapper = hierarchicalFilterWrapper.find(
        getDataTestSelector('children-filters')
      );

      expect(childrenFiltersWrapper.element).toBeUndefined();
      expect(getFiltersWrappers()).toHaveLength(1);
      getFiltersWrappers().forEach(filterWrapper =>
        expect(filterWrapper.text()).toEqual(filter.label)
      );
    });

    it('emits `UserClickedAFilter` and `UserClickedAHierarchicalFilter` events when a child is clicked', () => {
      const { getFiltersWrappers, emitSpy } = render();
      expect(getFiltersWrappers().length).toBeGreaterThan(1);
      getFiltersWrappers().forEach(filterWrapper => {
        emitSpy.mockClear();
        filterWrapper.trigger('click');
        const filter = (filterWrapper as any).filter;

        expect(emitSpy).toHaveBeenCalledTimes(2);
        expect(emitSpy).toHaveBeenCalledWith('UserClickedAFilter', filter, metadata);
        expect(emitSpy).toHaveBeenCalledWith('UserClickedAHierarchicalFilter', filter, metadata);
      });
    });

    it('emits configured events when a child is clicked', () => {
      const { getFiltersWrappers, emitSpy } = render({
        clickEvents: {
          UserAcceptedAQuery: 'potato',
          UserBlurredSearchBox: undefined
        }
      });
      expect(getFiltersWrappers().length).toBeGreaterThan(1);
      getFiltersWrappers().forEach(filterWrapper => {
        emitSpy.mockClear();
        filterWrapper.trigger('click');
        const filter = (filterWrapper as any).filter;

        expect(emitSpy).toHaveBeenCalledTimes(4);
        ['UserClickedAFilter', 'UserClickedAHierarchicalFilter'].forEach(event => {
          expect(emitSpy).toHaveBeenCalledWith(event, filter, metadata);
        });
        expect(emitSpy).toHaveBeenCalledWith('UserAcceptedAQuery', 'potato', metadata);
        expect(emitSpy).toHaveBeenCalledWith('UserBlurredSearchBox', undefined, metadata);
      });
    });

    it('adds a CSS class when the filter is partially selected', () => {
      const { getFiltersWrappers, getPartiallySelectedFilters } = render();
      const partiallySelectedIds = getPartiallySelectedFilters().map(filter => filter.id);

      expect(getFiltersWrappers().length).toBeGreaterThan(0);

      getFiltersWrappers().forEach(filterWrapper => {
        const filter = (filterWrapper as any).filter;
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
      const { mutateFilter, getFilterWrapperByText, getFilters } = render({
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
           </HierarchicalFilter>`
      });

      const grandChild0Wrapper = getFilterWrapperByText('grand-child-0')!;
      const grandChild0Data = getFilters()[2];
      expect(grandChild0Wrapper.classes()).toHaveLength(2);
      expect(grandChild0Wrapper.classes()).toEqual(
        expect.arrayContaining(['x-facet-filter', 'x-hierarchical-filter'])
      );

      /* Filters with totalResults===0 should be disabled. */
      await mutateFilter(grandChild0Data, { totalResults: 0 });
      expect(grandChild0Wrapper.attributes()).toHaveProperty('disabled');
      expect(grandChild0Wrapper.classes()).toHaveLength(2);
      expect(grandChild0Wrapper.classes()).toEqual(
        expect.arrayContaining(['x-facet-filter', 'x-hierarchical-filter'])
      );

      /* As grand-child-0 is deselected and grand-child-1 selected, child-0 should have partial
       * select classes. As it is selected it should have selected classes
       */
      const child0Wrapper = getFilterWrapperByText('child-0')!;
      expect(child0Wrapper.attributes()).not.toHaveProperty('disabled');
      expect(child0Wrapper.classes()).toHaveLength(6);
      expect(child0Wrapper.classes()).toEqual(
        expect.arrayContaining([
          'x-facet-filter',
          'x-selected',
          'x-facet-filter--is-partially-selected',
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
          'x-facet-filter',
          'x-hierarchical-filter',
          'x-selected',
          'x-hierarchical-filter--is-selected'
        ])
      );
      // Child 0 Partial classes should be removed as grand-child is now selected
      expect(child0Wrapper.classes()).toHaveLength(4);
      expect(child0Wrapper.classes()).toEqual(
        expect.arrayContaining([
          'x-facet-filter',
          'x-selected',
          'x-hierarchical-filter',
          'x-hierarchical-filter--is-selected'
        ])
      );
    });

    it('allows adding classes to the inner filters lists', () => {
      const { hierarchicalFilterWrapper } = render({
        childrenFiltersClass: 'custom-class',
        facet: createHierarchicalFacetStub('category', createFilter => [
          createFilter('root', false, createFilter => [
            createFilter('filter 1', true),
            createFilter('filter 2', false, createFilter => [createFilter('filter 3', false)])
          ])
        ])
      });

      const wrappers = hierarchicalFilterWrapper.findAll(getDataTestSelector('children-filters'));
      expect(wrappers).toHaveLength(2);

      wrappers.forEach(wrapper => {
        expect(wrapper.classes('custom-class')).toBe(true);
      });
    });

    it('allows adding classes to the filter item', () => {
      const { hierarchicalFilterWrapper } = render({
        filterItemClass: 'custom-class',
        facet: createHierarchicalFacetStub('category', createFilter => [
          createFilter('root', false, createFilter => [
            createFilter('filter 1', true),
            createFilter('filter 2', false, createFilter => [createFilter('filter 3', false)])
          ])
        ])
      });

      const wrappers = hierarchicalFilterWrapper.findAll(getDataTestSelector('filter'));
      expect(wrappers).toHaveLength(4);

      wrappers.forEach(wrapper => {
        expect(wrapper.classes('custom-class')).toBe(true);
      });
    });
  });
});
