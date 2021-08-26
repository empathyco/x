import { EditableNumberRangeFilter } from '@empathyco/x-types';
import {
  createEditableNumberRangeFilter,
  createHierarchicalFilter,
  createNumberRangeFilter,
  createSimpleFilter,
  createNumberRangeFilter,
  createRawFilter,
  createSimpleFilter
} from '../../../../__stubs__/filters-stubs.factory';
import { FilterEntityFactory } from '../filter-entity.factory';
import { SingleSelectModifier } from '../single-select.modifier';
import {
  getStoreEditableNumberRangeFilter,
  getStoreFilter,
  getStoreFiltersByFacetId,
  isEditableNumberRangeFilterSelected,
  isFilterSelected,
  prepareFacetsStore
} from './utils';

describe('testing filters entity factory', () => {
  it('selects and deselects raw filters', () => {
    const store = prepareFacetsStore();
    const factory = new FilterEntityFactory();
    const rawFilter = createRawFilter('size:m');
    const rawFilterEntity = factory.createFilterEntity(store, rawFilter);

    // Selecting a raw filter that is not in the store should add it.
    rawFilterEntity.select(rawFilter);
    expect(isFilterSelected(store, rawFilter.id)).toBe(true);

    // Deselecting a raw filter should remove it from the store.
    rawFilterEntity.deselect(rawFilter);
    expect(getStoreFilter(store, rawFilter.id)).toBeUndefined();
  });

  it('selects and deselects simple filters', () => {
    const store = prepareFacetsStore();
    const factory = new FilterEntityFactory();
    const simpleFilter = createSimpleFilter('color', 'red');
    const simpleFilterEntity = factory.createFilterEntity(store, simpleFilter);

    // Selecting a simple filter that is not in the store should add it.
    simpleFilterEntity.select(simpleFilter);
    expect(isFilterSelected(store, simpleFilter.id)).toBe(true);

    // Deselecting a simple filter should keep it in the store with selected to false.
    simpleFilterEntity.deselect(simpleFilter);
    expect(isFilterSelected(store, simpleFilter.id)).toBe(false);
  });

  it('selects and deselects hierarchical filters', () => {
    const store = prepareFacetsStore();
    const factory = new FilterEntityFactory();
    const hierarchicalFilter = createHierarchicalFilter('category', 'shirts');
    const hierarchicalFilterEntity = factory.createFilterEntity(store, hierarchicalFilter);

    // Selecting a hierarchical filter that is not in the store should add it.
    hierarchicalFilterEntity.select(hierarchicalFilter);
    expect(isFilterSelected(store, hierarchicalFilter.id)).toBe(true);

    // Deselecting a hierarchical filter keep it in the store with selected to false.
    hierarchicalFilterEntity.deselect(hierarchicalFilter);
    expect(isFilterSelected(store, hierarchicalFilter.id)).toBe(false);
  });

  it('selects and deselects number range filters', () => {
    const store = prepareFacetsStore();
    const factory = new FilterEntityFactory();
    const numberRangeFilter = createNumberRangeFilter('price', { min: 10, max: 20 });
    const numberRangeFilterEntity = factory.createFilterEntity(store, numberRangeFilter);

    // Selecting a number range filter that is not in the store should add it.
    numberRangeFilterEntity.select(numberRangeFilter);
    expect(isFilterSelected(store, numberRangeFilter.id)).toBe(true);

    // Deselecting a number range filter should keep it in the store with selected to false.
    numberRangeFilterEntity.deselect(numberRangeFilter);
    expect(isFilterSelected(store, numberRangeFilter.id)).toBe(false);
  });

  it('selects and deselects editable number range filters', () => {
    const store = prepareFacetsStore();
    const factory = new FilterEntityFactory();
    const facetId = 'price';
    const editableNumberRangeFilter = createEditableNumberRangeFilter(facetId, {
      min: 10,
      max: null
    });
    const editableNumberRangeFilterEntity = factory.createFilterEntity(
      store,
      editableNumberRangeFilter
    );

    // Selecting a editable number range filter that is not in the store should add it as selected
    // and set new range values
    editableNumberRangeFilterEntity.select(editableNumberRangeFilter);
    expect(getStoreFiltersByFacetId(store, facetId)).toHaveLength(1);
    expect(isEditableNumberRangeFilterSelected(store, facetId)).toBe(true);
    expect(getStoreEditableNumberRangeFilter(store, facetId).range).toEqual({
      min: 10,
      max: null
    });

    // Selecting a editable number range filter already in the store but with other range of values,
    // it should replace previous filter in the store and change the range values and the filter id.
    let previousFilter = getStoreEditableNumberRangeFilter(store, facetId);
    const newFilter: EditableNumberRangeFilter = {
      ...previousFilter,
      range: { min: 10, max: 20 }
    };
    editableNumberRangeFilterEntity.select(newFilter);

    expect(getStoreFiltersByFacetId(store, facetId)).toHaveLength(1);
    expect(isEditableNumberRangeFilterSelected(store, facetId)).toBe(true);
    expect(getStoreEditableNumberRangeFilter(store, facetId).range).toEqual({
      min: 10,
      max: 20
    });
    expect(getStoreEditableNumberRangeFilter(store, facetId).id).not.toBe(previousFilter.id);

    // Deselecting a editable number range filter should  should keep it in the store with selected
    // to false and set the range values to null.
    previousFilter = getStoreEditableNumberRangeFilter(store, facetId);
    editableNumberRangeFilterEntity.deselect(previousFilter);

    expect(getStoreFiltersByFacetId(store, facetId)).toHaveLength(1);
    expect(isEditableNumberRangeFilterSelected(store, facetId)).toBe(false);
    expect(getStoreEditableNumberRangeFilter(store, facetId).range).toEqual({
      min: null,
      max: null
    });
    expect(getStoreEditableNumberRangeFilter(store, facetId).id).not.toBe(previousFilter.id);
  });

  describe('test raw behavior', () => {
    it('simple filter overrides raw filter', () => {
      const store = prepareFacetsStore();
      const factory = new FilterEntityFactory();

      const simpleFilter = createSimpleFilter('color', 'red');
      const simpleFilterEntity = factory.createFilterEntity(store, simpleFilter);
      const rawFilter = createRawFilter(String(simpleFilter.id));
      const rawFilterEntity = factory.createFilterEntity(store, rawFilter);

      rawFilterEntity.select(rawFilter);
      expect(isFilterSelected(store, rawFilter.id)).toBe(true);

      simpleFilterEntity.select(simpleFilter);
      expect(isFilterSelected(store, simpleFilter.id)).toBe(true);
      expect(getStoreFilter(store, simpleFilter.id)).toEqual({ ...simpleFilter, selected: true });
      expect(getStoreFilter(store, rawFilter.id)).toEqual(getStoreFilter(store, simpleFilter.id));
    });

    it('hierarchical filter overrides raw filter', () => {
      const store = prepareFacetsStore();
      const factory = new FilterEntityFactory();

      const hierarchicalFilter = createHierarchicalFilter('category', 'shirts');
      const hierarchicalFilterEntity = factory.createFilterEntity(store, hierarchicalFilter);
      const rawFilter = createRawFilter(String(hierarchicalFilter.id));
      const rawFilterEntity = factory.createFilterEntity(store, rawFilter);

      rawFilterEntity.select(rawFilter);
      expect(isFilterSelected(store, rawFilter.id)).toBe(true);

      hierarchicalFilterEntity.select(hierarchicalFilter);
      expect(isFilterSelected(store, hierarchicalFilter.id)).toBe(true);
      expect(getStoreFilter(store, hierarchicalFilter.id)).toEqual({
        ...hierarchicalFilter,
        selected: true
      });
      expect(getStoreFilter(store, rawFilter.id)).toEqual(
        getStoreFilter(store, hierarchicalFilter.id)
      );
    });

    it('number range filter overrides raw filter', () => {
      const store = prepareFacetsStore();
      const factory = new FilterEntityFactory();

      const numberRangeFilter = createNumberRangeFilter('price', { min: 10, max: null });
      const numberRangeFilterEntity = factory.createFilterEntity(store, numberRangeFilter);
      const rawFilter = createRawFilter(String(numberRangeFilter.id));
      const rawFilterEntity = factory.createFilterEntity(store, rawFilter);

      rawFilterEntity.select(rawFilter);
      expect(isFilterSelected(store, rawFilter.id)).toBe(true);

      numberRangeFilterEntity.select(numberRangeFilter);
      expect(isFilterSelected(store, numberRangeFilter.id)).toBe(true);
      expect(getStoreFilter(store, numberRangeFilter.id)).toEqual({
        ...numberRangeFilter,
        selected: true
      });
      expect(getStoreFilter(store, rawFilter.id)).toEqual(
        getStoreFilter(store, numberRangeFilter.id)
      );
    });
  });

  describe('testing modifiers', () => {
    it('decorates entities of the given facet with modifiers', () => {
      const store = prepareFacetsStore();
      const factory = new FilterEntityFactory();
      const redColorFilter = createSimpleFilter('color', 'red');
      const blueColorFilter = createSimpleFilter('color', 'blue');
      const mediumSizeFilter = createSimpleFilter('size', 'm');
      const largeSizeFilter = createSimpleFilter('size', 'l');
      factory.registerFilterModifier('color', [SingleSelectModifier]);
      const colorEntity = factory.createFilterEntity(store, redColorFilter);
      const sizeEntity = factory.createFilterEntity(store, mediumSizeFilter);

      colorEntity.select(redColorFilter);
      expect(isFilterSelected(store, redColorFilter.id)).toBe(true);

      colorEntity.select(blueColorFilter);
      expect(isFilterSelected(store, redColorFilter.id)).toBe(false);
      expect(isFilterSelected(store, blueColorFilter.id)).toBe(true);

      // Size entity shouldn not be decorated, therefore, its filters should be multiselectable.
      sizeEntity.select(mediumSizeFilter);
      sizeEntity.select(largeSizeFilter);
      colorEntity.select(redColorFilter);

      expect(isFilterSelected(store, redColorFilter.id)).toBe(true);
      expect(isFilterSelected(store, blueColorFilter.id)).toBe(false);
      expect(isFilterSelected(store, mediumSizeFilter.id)).toBe(true);
      expect(isFilterSelected(store, largeSizeFilter.id)).toBe(true);
    });
  });
});
