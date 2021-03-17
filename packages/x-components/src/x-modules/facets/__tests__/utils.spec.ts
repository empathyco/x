import { EditableNumberRangeFilter, SimpleFilter } from '@empathy/search-types';
import { areFiltersDifferent, isNewQuery } from '../utils';
import {
  createEditableNumberRangeFilter,
  createSimpleFilter
} from '../../../__stubs__/filters-stubs.factory';

describe('testing areFiltersDifferent util', () => {
  function createPriceEditableNumberRangeFilter(
    min: number | null,
    max: number | null
  ): EditableNumberRangeFilter {
    return createEditableNumberRangeFilter('price', 'editable', { min, max });
  }

  function createHierarchicalCategorySimpleFilter(label: string): SimpleFilter {
    return createSimpleFilter('hierarchical_category', label);
  }

  it('returns true with different filters', () => {
    const newFiltersArray: SimpleFilter[] = [
      createHierarchicalCategorySimpleFilter('rompecabezas'),
      createHierarchicalCategorySimpleFilter('puzzle')
    ];

    const oldFiltersArray: SimpleFilter[] = [
      createHierarchicalCategorySimpleFilter('lego'),
      createHierarchicalCategorySimpleFilter('puzzle')
    ];

    expect(areFiltersDifferent(newFiltersArray, oldFiltersArray)).toBe(true);
  });

  it('returns true when EditableNumberRangeFilter changes', () => {
    const newFiltersArray: (SimpleFilter | EditableNumberRangeFilter)[] = [
      createHierarchicalCategorySimpleFilter('rompecabezas'),
      createHierarchicalCategorySimpleFilter('puzzle'),
      createPriceEditableNumberRangeFilter(null, 3)
    ];

    const oldFiltersArray: (SimpleFilter | EditableNumberRangeFilter)[] = [
      createHierarchicalCategorySimpleFilter('lego'),
      createHierarchicalCategorySimpleFilter('puzzle'),
      createPriceEditableNumberRangeFilter(null, 9)
    ];

    expect(areFiltersDifferent(newFiltersArray, oldFiltersArray)).toBe(true);
  });

  it('returns false with the same filters', () => {
    const newFiltersArray: (SimpleFilter | EditableNumberRangeFilter)[] = [
      createHierarchicalCategorySimpleFilter('rompecabezas'),
      createHierarchicalCategorySimpleFilter('puzzle'),
      createPriceEditableNumberRangeFilter(5, 15)
    ];

    const oldFiltersArray: (SimpleFilter | EditableNumberRangeFilter)[] = [
      createHierarchicalCategorySimpleFilter('rompecabezas'),
      createHierarchicalCategorySimpleFilter('puzzle'),
      createPriceEditableNumberRangeFilter(5, 15)
    ];

    expect(areFiltersDifferent(newFiltersArray, oldFiltersArray)).toBe(false);
  });
});

describe('testing hasQueryChanged util', () => {
  it('returns true when the new query changes by one word', () => {
    const newQuery = 'pantalon verde';
    const previousQuery = 'pantalon rojo';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns true when the new query changes by one word in a different position', () => {
    const newQuery = 'calcetin verde';
    const previousQuery = 'pantalon rojo';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns true when the query changes by one word in the middle of the query', () => {
    const newQuery = 'pantalones largos de pana azules';
    const previousQuery = 'pantalones cortos de pana azules';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns false when the new query has only one different word', () => {
    const newQuery = 'pantalon corto rojo';
    const previousQuery = 'pantalon corto';
    expect(isNewQuery(newQuery, previousQuery)).toBe(false);
  });
  it('returns false when the new query has only one different word in a different position', () => {
    const newQuery = 'pantalon rojo corto';
    const previousQuery = 'pantalon corto';
    expect(isNewQuery(newQuery, previousQuery)).toBe(false);
  });
  it('returns false when the new query has the same words but with less letters', () => {
    const newQuery = 'pantalon corto';
    const previousQuery = 'pantalones cortos';
    expect(isNewQuery(newQuery, previousQuery)).toBe(false);
  });
});
