import { createNextHierarchicalFacetStub } from '../../../../__stubs__/facets-stubs.factory';
import {
  createNextEditableNumberRangeFilter,
  createNextNumberRangeFilter,
  createNextSimpleFilter,
  createRawFilter
} from '../../../../__stubs__/filters-stubs.factory';
import { EditableNumberRangeFilterEntity } from '../editable-number-range-filter.entity';
import { HierarchicalFilterEntity } from '../hierarchical-filter.entity';
import { NumberRangeFilterEntity } from '../number-range-filter.entity';
import { RawFilterEntity } from '../raw-filter.entity';
import { SimpleFilterEntity } from '../simple-filter.entity';
import { SingleSelectModifier } from '../single-select.modifier';
import { FilterEntity } from '../types';
import {
  getStoreEditableNumberRangeFilter,
  getStoreFilter,
  getStoreFiltersByFacetId,
  isFilterSelected,
  prepareFacetsStore
} from './utils';

describe('testing single select modifier', () => {
  it('makes single select simple filters', () => {
    const redColorFilter = createNextSimpleFilter('color', 'red');
    const blueColorFilter = createNextSimpleFilter('color', 'blue');
    const store = prepareFacetsStore([redColorFilter, blueColorFilter]);
    const entity = new SingleSelectModifier(store, new SimpleFilterEntity(store));

    entity.select(redColorFilter);
    expect(isFilterSelected(store, redColorFilter.id)).toBe(true);
    expect(isFilterSelected(store, blueColorFilter.id)).toBe(false);

    entity.select(blueColorFilter);
    expect(isFilterSelected(store, redColorFilter.id)).toBe(false);
    expect(isFilterSelected(store, blueColorFilter.id)).toBe(true);

    entity.select(redColorFilter);
    expect(isFilterSelected(store, redColorFilter.id)).toBe(true);
    expect(isFilterSelected(store, blueColorFilter.id)).toBe(false);

    entity.deselect(redColorFilter);
    expect(isFilterSelected(store, redColorFilter.id)).toBe(false);
    expect(isFilterSelected(store, blueColorFilter.id)).toBe(false);
  });

  it('makes single select hierarchical filters', () => {
    /*
     Dairy & Eggs
     Milk
     Yogurt
     Flavored yogurt
     Natural & Organic
     */
    const categoryFacet = createNextHierarchicalFacetStub('category', createFilter => [
      ...createFilter('Dairy & Eggs', false, createFilter => [
        ...createFilter('Milk', false),
        ...createFilter('Yogurt', false, createFilter => createFilter('Flavored Yogurt', false))
      ]),
      ...createFilter('Natural & Organic', false)
    ]);
    const store = prepareFacetsStore(categoryFacet.filters);
    const entity = new SingleSelectModifier(store, new HierarchicalFilterEntity(store));
    const [
      dairyAndEggsFilter,
      milkFilter,
      yogurtFilter,
      flavoredYogurtFilter,
      naturalOrganicFilter
    ] = categoryFacet.filters;

    // Select parent
    entity.select(dairyAndEggsFilter);
    expect(isFilterSelected(store, dairyAndEggsFilter.id)).toBe(true);
    expect(isFilterSelected(store, milkFilter.id)).toBe(false);
    expect(isFilterSelected(store, yogurtFilter.id)).toBe(false);
    expect(isFilterSelected(store, flavoredYogurtFilter.id)).toBe(false);
    expect(isFilterSelected(store, naturalOrganicFilter.id)).toBe(false);

    // Select child
    entity.select(yogurtFilter);
    expect(isFilterSelected(store, dairyAndEggsFilter.id)).toBe(true);
    expect(isFilterSelected(store, milkFilter.id)).toBe(false);
    expect(isFilterSelected(store, yogurtFilter.id)).toBe(true);
    expect(isFilterSelected(store, flavoredYogurtFilter.id)).toBe(false);
    expect(isFilterSelected(store, naturalOrganicFilter.id)).toBe(false);

    // Select grandchild
    entity.select(flavoredYogurtFilter);
    expect(isFilterSelected(store, dairyAndEggsFilter.id)).toBe(true);
    expect(isFilterSelected(store, milkFilter.id)).toBe(false);
    expect(isFilterSelected(store, yogurtFilter.id)).toBe(true);
    expect(isFilterSelected(store, flavoredYogurtFilter.id)).toBe(true);
    expect(isFilterSelected(store, naturalOrganicFilter.id)).toBe(false);

    // Select parent sibling
    entity.select(naturalOrganicFilter);
    expect(isFilterSelected(store, dairyAndEggsFilter.id)).toBe(false);
    expect(isFilterSelected(store, milkFilter.id)).toBe(false);
    expect(isFilterSelected(store, yogurtFilter.id)).toBe(false);
    expect(isFilterSelected(store, flavoredYogurtFilter.id)).toBe(false);
    expect(isFilterSelected(store, naturalOrganicFilter.id)).toBe(true);

    // Select grandchild without ancestors selected
    entity.select(flavoredYogurtFilter);
    expect(isFilterSelected(store, dairyAndEggsFilter.id)).toBe(true);
    expect(isFilterSelected(store, milkFilter.id)).toBe(false);
    expect(isFilterSelected(store, yogurtFilter.id)).toBe(true);
    expect(isFilterSelected(store, flavoredYogurtFilter.id)).toBe(true);
    expect(isFilterSelected(store, naturalOrganicFilter.id)).toBe(false);

    // Deselect child
    entity.deselect(yogurtFilter);
    expect(isFilterSelected(store, dairyAndEggsFilter.id)).toBe(true);
    expect(isFilterSelected(store, milkFilter.id)).toBe(false);
    expect(isFilterSelected(store, yogurtFilter.id)).toBe(false);
    expect(isFilterSelected(store, flavoredYogurtFilter.id)).toBe(false);
    expect(isFilterSelected(store, naturalOrganicFilter.id)).toBe(false);
  });

  it('makes single select number range filters', () => {
    const ageLessThan10Filter = createNextNumberRangeFilter('age', { min: null, max: 10 });
    const ageLessFrom10To20Filter = createNextNumberRangeFilter('age', { min: 10, max: 20 });
    const store = prepareFacetsStore([ageLessThan10Filter, ageLessFrom10To20Filter]);
    const entity = new SingleSelectModifier(store, new NumberRangeFilterEntity(store));

    entity.select(ageLessThan10Filter);
    expect(isFilterSelected(store, ageLessThan10Filter.id)).toBe(true);
    expect(isFilterSelected(store, ageLessFrom10To20Filter.id)).toBe(false);

    entity.select(ageLessFrom10To20Filter);
    expect(isFilterSelected(store, ageLessThan10Filter.id)).toBe(false);
    expect(isFilterSelected(store, ageLessFrom10To20Filter.id)).toBe(true);

    entity.select(ageLessThan10Filter);
    expect(isFilterSelected(store, ageLessThan10Filter.id)).toBe(true);
    expect(isFilterSelected(store, ageLessFrom10To20Filter.id)).toBe(false);

    entity.deselect(ageLessThan10Filter);
    expect(isFilterSelected(store, ageLessThan10Filter.id)).toBe(false);
    expect(isFilterSelected(store, ageLessFrom10To20Filter.id)).toBe(false);
  });

  it('makes single select editable number range filters', () => {
    /* Single select modifier shouldn't be used with editable number range filters. It should only
    exist one of this filters of the same facet at the same time. However, if accidentally used
    it shouldn't break its functionality. */
    const facetId = 'age';
    const ageLessThan10Filter = createNextEditableNumberRangeFilter(facetId, {
      min: null,
      max: 10
    });
    const ageLessFrom10To20Filter = createNextEditableNumberRangeFilter(facetId, {
      min: 10,
      max: 20
    });
    const store = prepareFacetsStore();
    const entity = new SingleSelectModifier(store, new EditableNumberRangeFilterEntity(store));

    entity.select(ageLessThan10Filter);
    expect(getStoreFiltersByFacetId(store, facetId)).toHaveLength(1);
    expect(getStoreEditableNumberRangeFilter(store, facetId).range).toEqual(
      ageLessThan10Filter.range
    );

    entity.select(ageLessFrom10To20Filter);
    expect(getStoreFiltersByFacetId(store, facetId)).toHaveLength(1);
    expect(getStoreEditableNumberRangeFilter(store, facetId).range).toEqual(
      ageLessFrom10To20Filter.range
    );

    entity.select(ageLessThan10Filter);
    expect(getStoreFiltersByFacetId(store, facetId)).toHaveLength(1);
    expect(getStoreEditableNumberRangeFilter(store, facetId).range).toEqual(
      ageLessThan10Filter.range
    );

    entity.deselect(ageLessThan10Filter);
    expect(getStoreFiltersByFacetId(store, facetId)).toHaveLength(1);
    expect(getStoreEditableNumberRangeFilter(store, facetId).range).toEqual({
      min: null,
      max: null
    });
  });

  it('makes single select raw filters', () => {
    /* Single select modifier shouldn't be used with raw filters. Raw filters are usually filters
     that we don't have enough information from them, like the ones stored in the URL, so we
     shouldn't add more functionality to them. However, if accidentally used it shouldn't break
     its functionality. */
    const redColorFilter = createRawFilter('color:red');
    const blueColorFilter = createRawFilter('color:blue');
    const store = prepareFacetsStore([redColorFilter, blueColorFilter]);
    const entity: FilterEntity = new SingleSelectModifier(store, new RawFilterEntity(store));

    entity.select(redColorFilter);
    expect(isFilterSelected(store, redColorFilter.id)).toBe(true);
    expect(isFilterSelected(store, blueColorFilter.id)).toBe(true);

    entity.select(blueColorFilter);
    expect(isFilterSelected(store, redColorFilter.id)).toBe(true);
    expect(isFilterSelected(store, blueColorFilter.id)).toBe(true);

    entity.select(redColorFilter);
    expect(isFilterSelected(store, redColorFilter.id)).toBe(true);
    expect(isFilterSelected(store, blueColorFilter.id)).toBe(true);

    entity.deselect(redColorFilter);
    expect(getStoreFilter(store, redColorFilter.id)).toBeUndefined();
    expect(isFilterSelected(store, blueColorFilter.id)).toBe(true);

    entity.deselect(blueColorFilter);
    expect(getStoreFilter(store, redColorFilter.id)).toBeUndefined();
    expect(getStoreFilter(store, blueColorFilter.id)).toBeUndefined();
  });
});
