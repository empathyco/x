import { createHierarchicalFacetStub, createSimpleFilter } from '../../../../__stubs__/index';
import { StickyModifier } from '../sticky.modifier';
import { SimpleFilterEntity } from '../simple-filter.entity';
import { HierarchicalFilterEntity } from '../hierarchical-filter.entity';
import { isFilterSelected, prepareFacetsStore } from './utils';

describe('testing sticky modifier', () => {
  it('keeps simple filters selected', () => {
    const redColorFilter = createSimpleFilter('color', 'red', true);
    const blueColorFilter = createSimpleFilter('color', 'blue', true);
    const store = prepareFacetsStore([redColorFilter, blueColorFilter]);
    const entity = new StickyModifier(store, new SimpleFilterEntity(store));

    entity.deselect(redColorFilter, { keepSticky: true });
    entity.deselect(blueColorFilter);

    expect(isFilterSelected(store, redColorFilter.id)).toBe(true);
    expect(isFilterSelected(store, blueColorFilter.id)).toBe(false);
  });

  it('keeps hierarchical filters selected', () => {
    const categoryFacet = createHierarchicalFacetStub('category', createFilter => [
      createFilter('Dairy & Eggs', false, createFilter => [createFilter('Milk', false)])
    ]);
    const store = prepareFacetsStore(categoryFacet.filters);
    const entity = new StickyModifier(store, new HierarchicalFilterEntity(store));

    const dairyAndEggsFilter = categoryFacet.filters[0];
    const milkFilter = dairyAndEggsFilter.children![0];

    entity.select(milkFilter);
    expect(isFilterSelected(store, dairyAndEggsFilter.id)).toBe(true);
    expect(isFilterSelected(store, milkFilter.id)).toBe(true);

    entity.deselect(dairyAndEggsFilter, { keepSticky: true });
    expect(isFilterSelected(store, dairyAndEggsFilter.id)).toBe(true);
    expect(isFilterSelected(store, milkFilter.id)).toBe(true);

    entity.deselect(milkFilter);
    expect(isFilterSelected(store, dairyAndEggsFilter.id)).toBe(true);
    expect(isFilterSelected(store, milkFilter.id)).toBe(false);

    entity.select(dairyAndEggsFilter);
    entity.deselect(dairyAndEggsFilter);
    expect(isFilterSelected(store, dairyAndEggsFilter.id)).toBe(false);
    expect(isFilterSelected(store, milkFilter.id)).toBe(false);
  });
});
