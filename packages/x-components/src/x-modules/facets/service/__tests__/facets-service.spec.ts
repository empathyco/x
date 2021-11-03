import { EditableNumberRangeFilter, Filter, Facet } from '@empathyco/x-types';
import {
  createEditableNumberRangeFacetStub,
  createHierarchicalFacetStub,
  createNumberRangeFacetStub,
  createSimpleFacetStub
} from '../../../../__stubs__/facets-stubs.factory';
import {
  createEditableNumberRangeFilter,
  createHierarchicalFilter,
  createNumberRangeFilter,
  createSimpleFilter,
  createRawFilter
} from '../../../../__stubs__/filters-stubs.factory';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { areFiltersDifferent } from '../../../../utils/filters';
import {
  getStoreEditableNumberRangeFilter,
  getStoreFilter,
  isEditableNumberRangeFilterSelected,
  isFilterSelected
} from '../../entities/__tests__/utils';
import { FilterEntityFactory } from '../../entities/filter-entity.factory';
import { SingleSelectModifier } from '../../entities/single-select.modifier';
import { facetsXModule } from '../../x-module';
import { DefaultFacetsService } from '../facets.service';
import { FacetsService } from '../types';

/**
 * Creates a fresh new {@link DefaultFacetsService} with some helpful test methods.
 *
 * @param filterEntityFactory - The optional filterEntityFactory to use in the test.
 * @returns An object containing methods for testing {@link DefaultFacetsService}.
 */
function prepareFacetsService(
  filterEntityFactory: FilterEntityFactory = new FilterEntityFactory()
): FacetsServiceTestAPI {
  XPlugin.resetInstance();
  installNewXPlugin();
  XPlugin.registerXModule(facetsXModule);

  return {
    service: new DefaultFacetsService(filterEntityFactory),
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
      return XPlugin.store.getters['x/facets/selectedFilters'];
    },
    getFilters() {
      return Object.values(XPlugin.store.state.x.facets.filters);
    },
    getFacets() {
      return XPlugin.store.state.x.facets.facets;
    }
  };
}

describe('testing facets service', () => {
  describe('selects & deselects a filter', () => {
    it('selects & deselects a simple filter', () => {
      const { service, isFilterSelected } = prepareFacetsService();
      const simpleFilter = createSimpleFilter('size', 'xs', false);

      service.select(simpleFilter);
      expect(isFilterSelected(simpleFilter)).toBe(true);

      service.deselect(simpleFilter);
      expect(isFilterSelected(simpleFilter)).toBe(false);
    });

    it('selects & deselects a hierarchical filter', () => {
      const { service, isFilterSelected } = prepareFacetsService();
      const hierarchicalFilter = createHierarchicalFilter('category', 'shirts', false);

      service.select(hierarchicalFilter);
      expect(isFilterSelected(hierarchicalFilter)).toBe(true);

      service.deselect(hierarchicalFilter);
      expect(isFilterSelected(hierarchicalFilter)).toBe(false);
    });

    it('selects & deselects a number range filter', () => {
      const { service, isFilterSelected } = prepareFacetsService();
      const numberRangeFilter = createNumberRangeFilter('age', { min: 10, max: 20 }, false);

      service.select(numberRangeFilter);
      expect(isFilterSelected(numberRangeFilter)).toBe(true);

      service.deselect(numberRangeFilter);
      expect(isFilterSelected(numberRangeFilter)).toBe(false);
    });

    it('selects & deselects an editable number range filter', () => {
      const { service, isEditableNumberRangeFilterSelected, getStoreEditableNumberRangeFilter } =
        prepareFacetsService();
      const editableNumberRangeFilter = createEditableNumberRangeFilter(
        'price',
        {
          min: 0,
          max: 40
        },
        false
      );

      service.select(editableNumberRangeFilter);
      expect(isEditableNumberRangeFilterSelected(editableNumberRangeFilter)).toBe(true);
      expect(getStoreEditableNumberRangeFilter(editableNumberRangeFilter).range).toEqual({
        min: 0,
        max: 40
      });

      service.deselect(editableNumberRangeFilter);
      expect(isEditableNumberRangeFilterSelected(editableNumberRangeFilter)).toBe(false);
      expect(getStoreEditableNumberRangeFilter(editableNumberRangeFilter).range).toEqual({
        min: null,
        max: null
      });
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
      const simpleFilter = createSimpleFilter('size', 'xs', false);

      service.toggle(simpleFilter);
      expect(isFilterSelected(simpleFilter)).toBe(true);

      service.toggle(getStoreFilter(simpleFilter));
      expect(isFilterSelected(simpleFilter)).toBe(false);
    });

    it('toggles a hierarchical filter', () => {
      const { service, isFilterSelected, getStoreFilter } = prepareFacetsService();
      const hierarchicalFilter = createHierarchicalFilter('category', 'shirts', false);

      service.toggle(hierarchicalFilter);
      expect(isFilterSelected(hierarchicalFilter)).toBe(true);

      service.toggle(getStoreFilter(hierarchicalFilter));
      expect(isFilterSelected(hierarchicalFilter)).toBe(false);
    });

    it('toggles a number range filter', () => {
      const { service, isFilterSelected, getStoreFilter } = prepareFacetsService();
      const numberRangeFilter = createNumberRangeFilter('age', { min: 10, max: 20 }, false);

      service.toggle(numberRangeFilter);
      expect(isFilterSelected(numberRangeFilter)).toBe(true);

      service.toggle(getStoreFilter(numberRangeFilter));
      expect(isFilterSelected(numberRangeFilter)).toBe(false);
    });

    it('toggles an editable number range filter', () => {
      const { service, isEditableNumberRangeFilterSelected, getStoreEditableNumberRangeFilter } =
        prepareFacetsService();
      const editableNumberRangeFilter = createEditableNumberRangeFilter(
        'price',
        {
          min: 0,
          max: 30
        },
        false
      );

      service.toggle(editableNumberRangeFilter);
      expect(isEditableNumberRangeFilterSelected(editableNumberRangeFilter)).toBe(true);
      expect(getStoreEditableNumberRangeFilter(editableNumberRangeFilter).range).toEqual({
        min: 0,
        max: 30
      });

      service.toggle(getStoreEditableNumberRangeFilter(editableNumberRangeFilter));
      expect(isEditableNumberRangeFilterSelected(editableNumberRangeFilter)).toBe(false);
      expect(getStoreEditableNumberRangeFilter(editableNumberRangeFilter).range).toEqual({
        min: null,
        max: null
      });
    });
  });

  describe('clears filters', () => {
    it('deselects all filters', () => {
      const { service, getSelectedFilters } = prepareFacetsService();

      [
        createRawFilter('size:l'),
        createEditableNumberRangeFilter('age', { min: null, max: 30 }),
        createNumberRangeFilter('price', { min: null, max: 10 }),
        createHierarchicalFilter('category', 'shirt'),
        createSimpleFilter('color', 'red', false)
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
        createEditableNumberRangeFilter('age', { min: null, max: 30 }),
        createNumberRangeFilter('price', { min: null, max: 10 }),
        createHierarchicalFilter('category', 'shirt'),
        createSimpleFilter('color', 'red', false)
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
      const {
        service,
        getSelectedFilters,
        getFilters,
        getStoreEditableNumberRangeFilter,
        getFacets
      } = prepareFacetsService();

      const colorFacet = createSimpleFacetStub('color', createFilter => [
        createFilter('red', true),
        createFilter('blue')
      ]);
      const redColorFilter = colorFacet.filters[0];
      const categoryFacet = createHierarchicalFacetStub('category', createFilter => [
        ...createFilter('men'),
        ...createFilter('women', false, createFilter => [
          ...createFilter('skirt', true),
          ...createFilter('dress')
        ])
      ]);
      const menCategoryFilter = categoryFacet.filters[0];
      const ageFacet = createNumberRangeFacetStub('age', createFilter => [
        createFilter({ min: 0, max: 10 }, true),
        createFilter({ min: 10, max: 18 })
      ]);
      const age10To18Filter = ageFacet.filters[0];
      const priceFacet = createEditableNumberRangeFacetStub('price', createFilter =>
        createFilter({ min: null, max: 10 }, true)
      );
      const priceUpTo10Filter = priceFacet.filters[0];

      // Save a fresh new facets group. Because there
      // are no previous filters, all filters should be deselected.
      service.updateFacets({
        id: 'backend',
        facets: [colorFacet, categoryFacet, ageFacet, priceFacet]
      });
      expect(
        areFiltersDifferent(getFilters(), [
          ...colorFacet.filters,
          ...categoryFacet.filters,
          ...ageFacet.filters,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter)
        ])
      ).toBe(false);
      expect(getSelectedFilters()).toEqual([]);
      expect(getFacets()).toEqual({
        [colorFacet.id]: omitFiltersProperty(colorFacet),
        [categoryFacet.id]: omitFiltersProperty(categoryFacet),
        [ageFacet.id]: omitFiltersProperty(ageFacet),
        [priceFacet.id]: omitFiltersProperty(priceFacet)
      });

      // Select some filters, and save a new group of facets
      service.select(redColorFilter);
      service.select(menCategoryFilter);
      service.select(age10To18Filter);
      service.select(priceUpTo10Filter);
      expect(
        areFiltersDifferent(getSelectedFilters(), [
          redColorFilter,
          menCategoryFilter,
          age10To18Filter,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter)
        ])
      ).toBe(false);

      const newColorFacet = createSimpleFacetStub('color', createFilter => [
        createFilter('red'),
        createFilter('blue', true),
        createFilter('green', true)
      ]);
      const newCategoryFacet = createHierarchicalFacetStub('category', createFilter => [
        ...createFilter('men'),
        ...createFilter('women', true, createFilter => [
          ...createFilter('skirt', true),
          ...createFilter('dress')
        ]),
        ...createFilter('kids')
      ]);
      const newAgeFacet = createNumberRangeFacetStub('age', createFilter => [
        createFilter({ min: 0, max: 10 }),
        createFilter({ min: 10, max: 18 }, true),
        createFilter({ min: 18, max: null }, true)
      ]);
      const newPriceFacet = createEditableNumberRangeFacetStub('price', createFilter =>
        createFilter({ min: null, max: 10 }, true)
      );

      service.updateFacets({
        id: 'backend',
        facets: [newColorFacet, newCategoryFacet, newAgeFacet, newPriceFacet]
      });
      expect(
        areFiltersDifferent(getFilters(), [
          ...newColorFacet.filters,
          ...newCategoryFacet.filters,
          ...newAgeFacet.filters,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter)
        ])
      ).toBe(false);
      expect(
        // Because newPriceFacet filter has a different id in this new group, it is de selected
        areFiltersDifferent(getSelectedFilters(), [
          redColorFilter,
          menCategoryFilter,
          age10To18Filter
        ])
      ).toBe(false);

      // Saving a new group of facets shouldn't affect previous ones
      const shipmentFacet = createSimpleFacetStub('shipment', createFilter => [
        createFilter('In store', true),
        createFilter('Express')
      ]);
      service.updateFacets({
        id: 'static',
        facets: [shipmentFacet]
      });
      expect(
        areFiltersDifferent(getFilters(), [
          ...newColorFacet.filters,
          ...newCategoryFacet.filters,
          ...newAgeFacet.filters,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter),
          ...shipmentFacet.filters
        ])
      ).toBe(false);
      expect(
        areFiltersDifferent(getSelectedFilters(), [
          redColorFilter,
          menCategoryFilter,
          age10To18Filter
        ])
      ).toBe(false);
      expect(getFacets()).toEqual({
        [colorFacet.id]: omitFiltersProperty(colorFacet),
        [categoryFacet.id]: omitFiltersProperty(categoryFacet),
        [ageFacet.id]: omitFiltersProperty(ageFacet),
        [priceFacet.id]: omitFiltersProperty(priceFacet),
        [shipmentFacet.id]: omitFiltersProperty(shipmentFacet)
      });
    });

    // eslint-disable-next-line max-len
    it('saves groups containing multiple deselected hierarchical filters levels that were not in the store', () => {
      const { service, getFilters, getSelectedFilters } = prepareFacetsService();
      const categoryFacet = createHierarchicalFacetStub('category', createFilter => [
        ...createFilter('men'),
        ...createFilter('women', false, createFilter => [
          ...createFilter('skirt', false, createFilter => [
            ...createFilter('long skirts'),
            ...createFilter('floral skirts')
          ]),
          ...createFilter('dress', false, createFilter => [...createFilter('short dresses')])
        ])
      ]);

      service.updateFacets({
        id: 'static',
        facets: [categoryFacet]
      });
      expect(areFiltersDifferent(getFilters(), categoryFacet.filters)).toBe(false);
      expect(getSelectedFilters()).toEqual([]);
    });
  });

  describe('sets a group of facets', () => {
    it('sets groups of facets', () => {
      const {
        service,
        getSelectedFilters,
        getFilters,
        getStoreEditableNumberRangeFilter,
        getFacets
      } = prepareFacetsService();

      const colorFacet = createSimpleFacetStub('color', createFilter => [
        createFilter('red', true),
        createFilter('blue')
      ]);
      const redColorFilter = colorFacet.filters[0];
      const categoryFacet = createHierarchicalFacetStub('category', createFilter => [
        ...createFilter('men'),
        ...createFilter('women', true, createFilter => [
          ...createFilter('skirt', true),
          ...createFilter('dress')
        ])
      ]);
      const [, womenCategoryFilter, skirtCategoryFilter] = categoryFacet.filters;
      const ageFacet = createNumberRangeFacetStub('age', createFilter => [
        createFilter({ min: 0, max: 10 }, true),
        createFilter({ min: 10, max: 18 })
      ]);
      const age10To18Filter = ageFacet.filters[0];
      const priceFacet = createEditableNumberRangeFacetStub('price', createFilter =>
        createFilter({ min: null, max: 10 }, true)
      );
      const priceUpTo10Filter = priceFacet.filters[0];

      // Set a fresh new facets group. Filters should keep the selected state they have
      service.setFacets({
        id: 'backend',
        facets: [colorFacet, categoryFacet, ageFacet, priceFacet]
      });
      expect(
        areFiltersDifferent(getFilters(), [
          ...colorFacet.filters,
          ...categoryFacet.filters,
          ...ageFacet.filters,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter)
        ])
      ).toBe(false);
      expect(getSelectedFilters()).toHaveLength(5);
      expect(getSelectedFilters()).toEqual(
        expect.arrayContaining([
          redColorFilter,
          womenCategoryFilter,
          skirtCategoryFilter,
          age10To18Filter,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter)
        ])
      );
      expect(getFacets()).toEqual({
        [colorFacet.id]: omitFiltersProperty(colorFacet),
        [categoryFacet.id]: omitFiltersProperty(categoryFacet),
        [ageFacet.id]: omitFiltersProperty(ageFacet),
        [priceFacet.id]: omitFiltersProperty(priceFacet)
      });

      // Set a new group of facets
      const newColorFacet = createSimpleFacetStub('color', createFilter => [
        createFilter('red'),
        createFilter('blue'),
        createFilter('green', true)
      ]);
      const greenColorFilter = newColorFacet.filters[2];
      const newCategoryFacet = createHierarchicalFacetStub('category', createFilter => [
        ...createFilter('men'),
        ...createFilter('women', false, createFilter => [
          ...createFilter('skirt'),
          ...createFilter('dress')
        ]),
        ...createFilter('kids', true)
      ]);
      const kidsCategoryFilter = newCategoryFacet.filters[4];
      const newAgeFacet = createNumberRangeFacetStub('age', createFilter => [
        createFilter({ min: 0, max: 10 }),
        createFilter({ min: 10, max: 18 }),
        createFilter({ min: 18, max: null }, true)
      ]);
      const ageMoreThan18Filter = newAgeFacet.filters[2];
      const newPriceFacet = createEditableNumberRangeFacetStub('price', createFilter =>
        createFilter({ min: null, max: 10 }, true)
      );

      service.setFacets({
        id: 'backend',
        facets: [newColorFacet, newCategoryFacet, newAgeFacet, newPriceFacet]
      });
      expect(
        areFiltersDifferent(getFilters(), [
          ...newColorFacet.filters,
          ...newCategoryFacet.filters,
          ...newAgeFacet.filters,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter)
        ])
      ).toBe(false);
      expect(
        areFiltersDifferent(getSelectedFilters(), [
          greenColorFilter,
          kidsCategoryFilter,
          ageMoreThan18Filter,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter)
        ])
      ).toBe(false);

      // Saving a new group of facets shouldn't affect previous ones
      const shipmentFacet = createSimpleFacetStub('shipment', createFilter => [
        createFilter('In store', true),
        createFilter('Express')
      ]);
      const inStoreShipmentFilter = shipmentFacet.filters[0];
      service.setFacets({
        id: 'static',
        facets: [shipmentFacet]
      });
      expect(
        areFiltersDifferent(getFilters(), [
          ...newColorFacet.filters,
          ...newCategoryFacet.filters,
          ...newAgeFacet.filters,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter),
          ...shipmentFacet.filters
        ])
      ).toBe(false);
      expect(
        areFiltersDifferent(getSelectedFilters(), [
          greenColorFilter,
          kidsCategoryFilter,
          ageMoreThan18Filter,
          getStoreEditableNumberRangeFilter(priceUpTo10Filter),
          inStoreShipmentFilter
        ])
      ).toBe(false);
      expect(getFacets()).toEqual({
        [colorFacet.id]: omitFiltersProperty(colorFacet),
        [categoryFacet.id]: omitFiltersProperty(categoryFacet),
        [ageFacet.id]: omitFiltersProperty(ageFacet),
        [priceFacet.id]: omitFiltersProperty(priceFacet),
        [shipmentFacet.id]: omitFiltersProperty(shipmentFacet)
      });
    });

    it('sets a new Single Select facet with multiple selected values', () => {
      const filterEntityFactory = new FilterEntityFactory();
      filterEntityFactory.registerFilterModifier('size', [SingleSelectModifier]);
      const { service, getSelectedFilters } = prepareFacetsService(filterEntityFactory);

      const newSizeFacet = createSimpleFacetStub('size', createFilter => [
        createFilter('s'),
        createFilter('m', true),
        createFilter('l', true)
      ]);

      service.setFacets({
        id: 'backend',
        facets: [newSizeFacet]
      });

      expect(getSelectedFilters()).toHaveLength(1);
    });

    it('updates and sets facets with different configurations', () => {
      const filterEntityFactory = new FilterEntityFactory();
      filterEntityFactory.registerFilterModifier('gender', [SingleSelectModifier]);
      const { service, getSelectedFilters } = prepareFacetsService(filterEntityFactory);

      const genderFacet = createSimpleFacetStub('gender', createFilter => [
        createFilter('women', true),
        createFilter('men')
      ]);

      const sizeFacet = createSimpleFacetStub('size', createFilter => [
        createFilter('s', true),
        createFilter('m', true),
        createFilter('l')
      ]);

      const [sizeSFilter, sizeMFilter] = sizeFacet.filters;
      const [womenFilter] = genderFacet.filters;

      service.setFacets({
        id: 'backend',
        facets: [genderFacet, sizeFacet]
      });

      expect(
        areFiltersDifferent(getSelectedFilters(), [sizeSFilter, sizeMFilter, womenFilter])
      ).toBe(false);

      const newGenderFacet = createSimpleFacetStub('gender', createFilter => [
        createFilter('women'),
        createFilter('men')
      ]);

      const newSizeFacet = createSimpleFacetStub('size', createFilter => [
        createFilter('s'),
        createFilter('m'),
        createFilter('l')
      ]);

      service.updateFacets({
        id: 'backend',
        facets: [newGenderFacet, newSizeFacet]
      });

      expect(
        areFiltersDifferent(getSelectedFilters(), [sizeSFilter, sizeMFilter, womenFilter])
      ).toBe(false);
    });
  });
});

/**
 * Utilities to test the facets service.
 */
interface FacetsServiceTestAPI {
  /**
   * Gets the stored facets.
   *
   * @returns A list containing the facets of the store.
   */
  getFacets: () => Record<Facet['id'], Omit<Facet, 'filters'>>;
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

/**
 * Excludes the filters property from the given facet.
 *
 * @param facet - The full facet from whom exclude its filter property.
 * @returns The given facet without the `filters` property.
 */
function omitFiltersProperty({ filters, ...facet }: Facet): Omit<Facet, 'filters'> {
  return facet;
}
