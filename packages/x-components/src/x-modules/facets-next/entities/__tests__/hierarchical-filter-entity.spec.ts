import { Filter } from '@empathyco/x-types-next';
import { Store } from 'vuex';
import { createNextHierarchicalFacetStub } from '../../../../__stubs__/facets-stubs.factory';
import { createNextHierarchicalFilter } from '../../../../__stubs__/filters-stubs.factory';
import { RootXStoreState } from '../../../../store/store.types';
import { HierarchicalFilterEntity } from '../hierarchical-filter.entity';
import { prepareFacetsStoreWithFilters } from './utils';

describe('testing HierarchicalFilterEntity', () => {
  it('allows selecting a filter that is not in the store', () => {
    const store = prepareFacetsStoreWithFilters([]);
    const categoryWomen = createNextHierarchicalFilter('category', 'women', false);
    const categoryWomenEntity = new HierarchicalFilterEntity(store, categoryWomen);

    categoryWomenEntity.select();
    expect(isFilterSelected(store, categoryWomen.id)).toBe(true);
  });

  it('allows deselecting a filter that is not in the store', () => {
    const store = prepareFacetsStoreWithFilters([]);
    const categoryWomen = createNextHierarchicalFilter('category', 'women', true);
    const categoryWomenEntity = new HierarchicalFilterEntity(store, categoryWomen);

    categoryWomenEntity.deselect();
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
    const categoryFacet = createNextHierarchicalFacetStub('category', createChild => [
      ...createChild('men', false, createChild => [
        ...createChild('shirts', false, createChild => createChild('long sleeve', false)),
        ...createChild('jeans', false)
      ]),
      ...createChild('women', false)
    ]);
    const store = prepareFacetsStoreWithFilters(categoryFacet.filters);
    const [categoryMen, categoryShirts, categoryLongSleeve, categoryJeans, categoryWomen] =
      categoryFacet.filters;
    const categoryLongSleeveEntity = new HierarchicalFilterEntity(store, categoryLongSleeve);
    const categoryMenEntity = new HierarchicalFilterEntity(store, categoryMen);
    const categoryJeansEntity = new HierarchicalFilterEntity(store, categoryJeans);

    // Select a nested filter. Parents should be selected
    categoryLongSleeveEntity.select();
    expect(isFilterSelected(store, categoryLongSleeve.id)).toBe(true);
    expect(isFilterSelected(store, categoryShirts.id)).toBe(true);
    expect(isFilterSelected(store, categoryMen.id)).toBe(true);
    expect(isFilterSelected(store, categoryJeans.id)).toBe(false);
    expect(isFilterSelected(store, categoryWomen.id)).toBe(false);

    // Select the jeans filter, previous selected filters should be kept.
    categoryJeansEntity.select();
    expect(isFilterSelected(store, categoryLongSleeve.id)).toBe(true);
    expect(isFilterSelected(store, categoryShirts.id)).toBe(true);
    expect(isFilterSelected(store, categoryMen.id)).toBe(true);
    expect(isFilterSelected(store, categoryJeans.id)).toBe(true);
    expect(isFilterSelected(store, categoryWomen.id)).toBe(false);

    // Deselect the root filter. No filters should be selected
    categoryMenEntity.deselect();
    expect(isFilterSelected(store, categoryLongSleeve.id)).toBe(false);
    expect(isFilterSelected(store, categoryShirts.id)).toBe(false);
    expect(isFilterSelected(store, categoryMen.id)).toBe(false);
    expect(isFilterSelected(store, categoryJeans.id)).toBe(false);
    expect(isFilterSelected(store, categoryWomen.id)).toBe(false);
  });

  function isFilterSelected(store: Store<RootXStoreState>, filterId: Filter['id']): boolean {
    return store.state.x.facetsNext.filters[filterId].selected;
  }
});
