import { createHierarchicalFacetStub } from '../../../../__stubs__/facets-stubs.factory';
import { createHierarchicalFilter } from '../../../../__stubs__/filters-stubs.factory';
import { HierarchicalFilterEntity } from '../hierarchical-filter.entity';
import { isFilterSelected, prepareFacetsStore } from './utils';

describe('testing HierarchicalFilterEntity', () => {
  it('allows selecting a filter that is not in the store', () => {
    const store = prepareFacetsStore([]);
    const categoryWomen = createHierarchicalFilter('category', 'women', false);
    const categoryWomenEntity = new HierarchicalFilterEntity(store);

    categoryWomenEntity.select(categoryWomen);
    expect(isFilterSelected(store, categoryWomen.id)).toBe(true);
  });

  it('allows deselecting a filter that is not in the store', () => {
    const store = prepareFacetsStore([]);
    const categoryWomen = createHierarchicalFilter('category', 'women', true);
    const categoryWomenEntity = new HierarchicalFilterEntity(store);

    categoryWomenEntity.deselect(categoryWomen);
    expect(isFilterSelected(store, categoryWomen.id)).toBe(false);
  });

  it('allows selecting and deselecting a filter', () => {
    /*
     Women
     Men
       Jeans
       Shirts
         Long Sleeve
     */
    const categoryFacet = createHierarchicalFacetStub('category', createChild => [
      createChild('men', false, createChild => [
        createChild('shirts', false, createChild => [createChild('long sleeve', false)]),
        createChild('jeans', false)
      ]),
      createChild('women', false)
    ]);
    const store = prepareFacetsStore(categoryFacet.filters);
    const categoryMen = categoryFacet.filters[0];
    const categoryWomen = categoryFacet.filters[1];
    const categoryShirts = categoryMen.children![0];
    const categoryLongSleeve = categoryShirts.children![0];
    const categoryJeans = categoryMen.children![1];
    const categoryEntity = new HierarchicalFilterEntity(store);

    // Select a nested filter. Parents should be selected
    categoryEntity.select(categoryLongSleeve);
    expect(isFilterSelected(store, categoryLongSleeve.id)).toBe(true);
    expect(isFilterSelected(store, categoryShirts.id)).toBe(true);
    expect(isFilterSelected(store, categoryMen.id)).toBe(true);
    expect(isFilterSelected(store, categoryJeans.id)).toBe(false);
    expect(isFilterSelected(store, categoryWomen.id)).toBe(false);

    // Select the jeans filter, previous selected filters should be kept.
    categoryEntity.select(categoryJeans);
    expect(isFilterSelected(store, categoryLongSleeve.id)).toBe(true);
    expect(isFilterSelected(store, categoryShirts.id)).toBe(true);
    expect(isFilterSelected(store, categoryMen.id)).toBe(true);
    expect(isFilterSelected(store, categoryJeans.id)).toBe(true);
    expect(isFilterSelected(store, categoryWomen.id)).toBe(false);

    // Deselect the root filter. No filters should be selected
    categoryEntity.deselect(categoryMen);
    expect(isFilterSelected(store, categoryLongSleeve.id)).toBe(false);
    expect(isFilterSelected(store, categoryShirts.id)).toBe(false);
    expect(isFilterSelected(store, categoryMen.id)).toBe(false);
    expect(isFilterSelected(store, categoryJeans.id)).toBe(false);
    expect(isFilterSelected(store, categoryWomen.id)).toBe(false);
  });
});
