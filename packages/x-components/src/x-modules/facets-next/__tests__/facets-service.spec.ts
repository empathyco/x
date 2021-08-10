import { EditableNumberRangeFilter, Filter } from '@empathyco/x-types-next';
import {
  createNextEditableNumberRangeFacetStub,
  createNextHierarchicalFacetStub,
  createNextNumberRangeFacetStub,
  createNextSimpleFacetStub
} from '../../../__stubs__/facets-stubs.factory';
import {
  createNextEditableNumberRangeFilter,
  createNextHierarchicalFilter,
  createNextNumberRangeFilter,
  createNextSimpleFilter,
  createRawFilter
} from '../../../__stubs__/filters-stubs.factory';
import { installNewXPlugin } from '../../../__tests__/utils';
import { XPlugin } from '../../../plugins/x-plugin';
import { BaseFacetsService } from '../base-facets.service';
import {
  getStoreEditableNumberRangeFilter,
  getStoreFilter,
  isEditableNumberRangeFilterSelected,
  isFilterSelected
} from '../entities/__tests__/utils';
import { FacetsService } from '../facets-service.types';
import { facetsNextXModule } from '../x-module';

/**
 * Creates a fresh new {@link BaseFacetsService} with some helpful test methods.
 *
 * @returns An object containing methods for testing {@link BaseFacetsService}.
 */
function prepareFacetsService(): FacetsServiceTestAPI {
  XPlugin.resetInstance();
  installNewXPlugin();
  XPlugin.registerXModule(facetsNextXModule);
  return {
    service: new BaseFacetsService(),
    isFilterSelected(filter) {
      return isFilterSelected(XPlugin.store, filter.id);
    },
    isEditableNumberRangeFilterSelected(filter) {
      return isEditableNumberRangeFilterSelected(XPlugin.store, filter.facetId);
    },
    isFilterInStore(filter) {
      return !!getStoreFilter(XPlugin.store, filter.id);
    },
    getStoreFilter(filter) {
      return getStoreFilter(XPlugin.store, filter.id);
    },
    getStoreEditableNumberRangeFilter(filter) {
      return getStoreEditableNumberRangeFilter(XPlugin.store, filter.facetId);
    },
    getSelectedFilters() {
      return XPlugin.store.getters['x/facetsNext/selectedFilters'];
    },
    getFilters() {
      return Object.values(XPlugin.store.state.x.facetsNext.filters);
    }
  };
}

describe('testing facets service', () => {
  describe('selects & deselects a filter', () => {
    it('selects & deselects a simple filter', () => {
      const { service, isFilterSelected } = prepareFacetsService();
      const simpleFilter = createNextSimpleFilter('size', 'xs', false);

      service.select(simpleFilter);
      expect(isFilterSelected(simpleFilter)).toBe(true);

      service.deselect(simpleFilter);
      expect(isFilterSelected(simpleFilter)).toBe(false);
    });

    it('selects & deselects a hierarchical filter', () => {
      const { service, isFilterSelected } = prepareFacetsService();
      const hierarchicalFilter = createNextHierarchicalFilter('category', 'shirts', false);

      service.select(hierarchicalFilter);
      expect(isFilterSelected(hierarchicalFilter)).toBe(true);

      service.deselect(hierarchicalFilter);
      expect(isFilterSelected(hierarchicalFilter)).toBe(false);
    });

    it('selects & deselects a number range filter', () => {
      const { service, isFilterSelected } = prepareFacetsService();
      const numberRangeFilter = createNextNumberRangeFilter('age', { min: 10, max: 20 }, false);

      service.select(numberRangeFilter);
      expect(isFilterSelected(numberRangeFilter)).toBe(true);

      service.deselect(numberRangeFilter);
      expect(isFilterSelected(numberRangeFilter)).toBe(false);
    });

    it('selects & deselects an editable number range filter', () => {
      const { service, isEditableNumberRangeFilterSelected } = prepareFacetsService();
      const editableNumberRangeFilter = createNextEditableNumberRangeFilter(
        'price',
        {
          min: 30,
          max: 40
        },
        false
      );

      service.select(editableNumberRangeFilter);
      expect(isEditableNumberRangeFilterSelected(editableNumberRangeFilter)).toBe(true);

      service.deselect(editableNumberRangeFilter);
      expect(isEditableNumberRangeFilterSelected(editableNumberRangeFilter)).toBe(false);
    });

    it('selects & deselects a raw filter', () => {
      const { service, isFilterSelected, isFilterInStore } = prepareFacetsService();
      const rawFilter = createRawFilter('color:red');

      service.select(rawFilter);
      expect(isFilterSelected(rawFilter)).toBe(true);

      service.deselect(rawFilter);
      expect(isFilterInStore(rawFilter)).toBe(false);
    });
  });

  describe('toggles a filter', () => {
    it('toggles a simple filter', () => {
      const { service, isFilterSelected, getStoreFilter } = prepareFacetsService();
      const simpleFilter = createNextSimpleFilter('size', 'xs', false);

      service.toggle(simpleFilter);
      expect(isFilterSelected(simpleFilter)).toBe(true);

      service.toggle(getStoreFilter(simpleFilter));
      expect(isFilterSelected(simpleFilter)).toBe(false);
    });

    it('toggles a hierarchical filter', () => {
      const { service, isFilterSelected, getStoreFilter } = prepareFacetsService();
      const hierarchicalFilter = createNextHierarchicalFilter('category', 'shirts', false);

      service.toggle(hierarchicalFilter);
      expect(isFilterSelected(hierarchicalFilter)).toBe(true);

      service.toggle(getStoreFilter(hierarchicalFilter));
      expect(isFilterSelected(hierarchicalFilter)).toBe(false);
    });

    it('toggles a number range filter', () => {
      const { service, isFilterSelected, getStoreFilter } = prepareFacetsService();
      const numberRangeFilter = createNextNumberRangeFilter('age', { min: 10, max: 20 }, false);

      service.toggle(numberRangeFilter);
      expect(isFilterSelected(numberRangeFilter)).toBe(true);

      service.toggle(getStoreFilter(numberRangeFilter));
      expect(isFilterSelected(numberRangeFilter)).toBe(false);
    });

    it('toggles an editable number range filter', () => {
      const { service, isEditableNumberRangeFilterSelected, getStoreEditableNumberRangeFilter } =
        prepareFacetsService();
      const editableNumberRangeFilter = createNextEditableNumberRangeFilter(
        'price',
        {
          min: 30,
          max: 40
        },
        false
      );

      service.toggle(editableNumberRangeFilter);
      expect(isEditableNumberRangeFilterSelected(editableNumberRangeFilter)).toBe(true);

      service.toggle(getStoreEditableNumberRangeFilter(editableNumberRangeFilter));
      expect(isEditableNumberRangeFilterSelected(editableNumberRangeFilter)).toBe(false);
    });
  });

  describe('compares if two list of filters are different', () => {
    it('returns true with different filters', () => {
      const { service } = prepareFacetsService();
      expect(service.areFiltersDifferent([createNextSimpleFilter('color', 'red')], [])).toBe(true);
      expect(service.areFiltersDifferent([], [createNextSimpleFilter('color', 'red')])).toBe(true);
      expect(
        service.areFiltersDifferent(
          [createNextSimpleFilter('color', 'red')],
          [createNextSimpleFilter('color', 'blue')]
        )
      ).toBe(true);
      expect(
        service.areFiltersDifferent(
          [createNextHierarchicalFilter('category', 'shirt')],
          [createNextHierarchicalFilter('category', 'jeans')]
        )
      ).toBe(true);
      expect(
        service.areFiltersDifferent(
          [createNextNumberRangeFilter('price', { min: null, max: 10 })],
          [createNextNumberRangeFilter('price', { min: null, max: 50 })]
        )
      ).toBe(true);
      expect(
        service.areFiltersDifferent(
          [createNextEditableNumberRangeFilter('age', { min: null, max: 10 })],
          [createNextEditableNumberRangeFilter('age', { min: null, max: 50 })]
        )
      ).toBe(true);
      expect(
        service.areFiltersDifferent([createRawFilter('size:m')], [createRawFilter('size:l')])
      ).toBe(true);
    });

    it('returns false with the same filters', () => {
      const { service } = prepareFacetsService();
      // Note that the selection state and the order of the filters doesn't matter. It just compares
      // if two arrays contains the same filters
      expect(
        service.areFiltersDifferent(
          [createNextSimpleFilter('color', 'red', false)],
          [createNextSimpleFilter('color', 'red', true)]
        )
      ).toBe(false);
      expect(
        service.areFiltersDifferent(
          [createNextHierarchicalFilter('category', 'shirt')],
          [createNextHierarchicalFilter('category', 'shirt')]
        )
      ).toBe(false);
      expect(
        service.areFiltersDifferent(
          [createNextNumberRangeFilter('price', { min: null, max: 10 })],
          [createNextNumberRangeFilter('price', { min: null, max: 10 })]
        )
      ).toBe(false);
      expect(
        service.areFiltersDifferent(
          [createNextEditableNumberRangeFilter('age', { min: null, max: 30 })],
          [createNextEditableNumberRangeFilter('age', { min: null, max: 30 })]
        )
      ).toBe(false);
      expect(
        service.areFiltersDifferent([createRawFilter('size:l')], [createRawFilter('size:l')])
      ).toBe(false);
      expect(
        service.areFiltersDifferent(
          [
            createNextSimpleFilter('color', 'red', false),
            createNextHierarchicalFilter('category', 'shirt'),
            createNextNumberRangeFilter('price', { min: null, max: 10 }),
            createNextEditableNumberRangeFilter('age', { min: null, max: 30 }),
            createRawFilter('size:l')
          ],
          [
            createRawFilter('size:l'),
            createNextEditableNumberRangeFilter('age', { min: null, max: 30 }),
            createNextNumberRangeFilter('price', { min: null, max: 10 }),
            createNextHierarchicalFilter('category', 'shirt'),
            createNextSimpleFilter('color', 'red', false)
          ]
        )
      ).toBe(false);
    });
  });

  describe('clears filters', () => {
    it('deselects all filters', () => {
      const { service, getSelectedFilters } = prepareFacetsService();

      [
        createRawFilter('size:l'),
        createNextEditableNumberRangeFilter('category', { min: null, max: 30 }),
        createNextNumberRangeFilter('category', { min: null, max: 10 }),
        createNextHierarchicalFilter('category', 'shirt'),
        createNextSimpleFilter('color', 'red', false)
      ].forEach(filter => {
        service.select(filter);
      });
      expect(getSelectedFilters()).toHaveLength(5);

      service.clearFilters();
      expect(getSelectedFilters()).toHaveLength(0);
    });

    it('deselects only filters from the given facets ids', () => {
      const { service, getSelectedFilters, isFilterSelected, isEditableNumberRangeFilterSelected } =
        prepareFacetsService();

      const filters = [
        createRawFilter('size:l'),
        createNextEditableNumberRangeFilter('age', { min: null, max: 30 }),
        createNextNumberRangeFilter('price', { min: null, max: 10 }),
        createNextHierarchicalFilter('category', 'shirt'),
        createNextSimpleFilter('color', 'red', false)
      ];
      filters.forEach(filter => {
        service.select(filter);
      });
      expect(getSelectedFilters()).toHaveLength(5);

      const [sizeFilter, ageFilter, priceFilter] = filters;
      service.clearFilters(['category', 'color']);
      expect(getSelectedFilters()).toHaveLength(3);
      expect(isFilterSelected(sizeFilter)).toBe(true);
      expect(isFilterSelected(priceFilter)).toBe(true);
      expect(isEditableNumberRangeFilterSelected(ageFilter as EditableNumberRangeFilter)).toBe(
        true
      );
    });
  });
  describe('saves a group of facets', () => {
    it('saves groups of facets keeping its previous selected states', () => {
      const { service, getSelectedFilters, getFilters, getStoreEditableNumberRangeFilter } =
        prepareFacetsService();

      const colorFacet = createNextSimpleFacetStub('color', createFilter => [
        createFilter('red', true),
        createFilter('blue')
      ]);
      const redColorFilter = colorFacet.filters[0];
      const categoryFacet = createNextHierarchicalFacetStub('category', createFilter => [
        ...createFilter('men'),
        ...createFilter('women', false, createFilter => [
          ...createFilter('skirt', true),
          ...createFilter('dress')
        ])
      ]);
      const menCategoryFilter = categoryFacet.filters[0];
      const ageFacet = createNextNumberRangeFacetStub('age', createFilter => [
        createFilter({ min: 0, max: 10 }, true),
        createFilter({ min: 10, max: 18 })
      ]);
      const age10To18Filter = ageFacet.filters[0];
      const priceFacet = createNextEditableNumberRangeFacetStub('price', createFilter =>
        createFilter({ min: null, max: 10 }, true)
      );
      const priceUpTo10Filter = priceFacet.filters[0];

      // Save a fresh new facets group. Because there
      // are no previous filters, all filters should be deselected.
      service.saveFacets({
        id: 'backend',
        facets: [colorFacet, categoryFacet, ageFacet, priceFacet]
      });
      expect(
        service.areFiltersDifferent(getFilters(), [
          ...colorFacet.filters,
          ...categoryFacet.filters,
          ...ageFacet.filters,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter)
        ])
      ).toBe(false);
      expect(getSelectedFilters()).toEqual([]);

      // Select some filters, and save a new group of facets
      service.select(redColorFilter);
      service.select(menCategoryFilter);
      service.select(age10To18Filter);
      service.select(priceUpTo10Filter);
      expect(
        service.areFiltersDifferent(getSelectedFilters(), [
          redColorFilter,
          menCategoryFilter,
          age10To18Filter,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter)
        ])
      ).toBe(false);

      const newColorFacet = createNextSimpleFacetStub('color', createFilter => [
        createFilter('red'),
        createFilter('blue', true),
        createFilter('green', true)
      ]);
      const newCategoryFacet = createNextHierarchicalFacetStub('category', createFilter => [
        ...createFilter('men'),
        ...createFilter('women', true, createFilter => [
          ...createFilter('skirt', true),
          ...createFilter('dress')
        ]),
        ...createFilter('kids')
      ]);
      const newAgeFacet = createNextNumberRangeFacetStub('age', createFilter => [
        createFilter({ min: 0, max: 10 }),
        createFilter({ min: 10, max: 18 }, true),
        createFilter({ min: 18, max: null }, true)
      ]);
      const newPriceFacet = createNextEditableNumberRangeFacetStub('price', createFilter =>
        createFilter({ min: null, max: 10 }, true)
      );

      service.saveFacets({
        id: 'backend',
        facets: [newColorFacet, newCategoryFacet, newAgeFacet, newPriceFacet]
      });
      expect(
        service.areFiltersDifferent(getFilters(), [
          ...newColorFacet.filters,
          ...newCategoryFacet.filters,
          ...newAgeFacet.filters,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter)
        ])
      ).toBe(false);
      expect(
        // Because newPriceFacet filter has a different id in this new group, it is de selected
        service.areFiltersDifferent(getSelectedFilters(), [
          redColorFilter,
          menCategoryFilter,
          age10To18Filter
        ])
      ).toBe(false);

      // Saving a new group of facets shouldn't affect previous ones
      const shipmentFacet = createNextSimpleFacetStub('shipment', createFilter => [
        createFilter('In store', true),
        createFilter('Express')
      ]);
      service.saveFacets({
        id: 'static',
        facets: [shipmentFacet]
      });
      expect(
        service.areFiltersDifferent(getFilters(), [
          ...newColorFacet.filters,
          ...newCategoryFacet.filters,
          ...newAgeFacet.filters,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter),
          ...shipmentFacet.filters
        ])
      ).toBe(false);
      expect(
        service.areFiltersDifferent(getSelectedFilters(), [
          redColorFilter,
          menCategoryFilter,
          age10To18Filter
        ])
      ).toBe(false);
    });
  });
});

interface FacetsServiceTestAPI {
  /**
   * Gets the stored filters.
   *
   * @returns A list containing the filters of the store.
   */
  getFilters: () => Filter[];
  /**
   * Gets the stored selected filters.
   *
   * @returns A list containing the selected filters of the store.
   */
  getSelectedFilters: () => Filter[];
  /**
   * Retrieves an editable number range filter from the store.
   *
   * @param filter - The filter to retrieve from the store.
   * @returns The stored editable number range filter.
   */
  getStoreEditableNumberRangeFilter: (
    filter: EditableNumberRangeFilter
  ) => EditableNumberRangeFilter;
  /**
   * Retrieves the filter with its same id from the store.
   *
   * @param filter - The filter to retrieve from the store.
   * @returns The filter from the store.
   */
  getStoreFilter: (filter: Filter) => Filter;
  /**
   * Returns if the editable number range filter is selected in the store.
   *
   * @param filter - The filter to check if it is effectively selected.
   * @returns True if the given filter is selected in the module store.
   */
  isEditableNumberRangeFilterSelected: (filter: EditableNumberRangeFilter) => boolean;
  /**
   * Returns if the filter is stored.
   *
   * @param filter - The filter to check if it is in the store.
   * @returns True if the filter is in the store.
   */
  isFilterInStore: (filter: Filter) => boolean;
  /**
   * Returns if the filter is selected in the store.
   *
   * @param filter - The filter to check if it is effectively selected.
   * @returns True if the given filter is selected in the module store.
   */
  isFilterSelected: (filter: Filter) => boolean;
  /**
   * The facets service to test.
   */
  service: FacetsService;
}
