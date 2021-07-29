import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import {
  createHierarchicalFilter,
  createNumberRangeFilter,
  createRawFilter,
  createSimpleFilter
} from '../../../../__stubs__/filters-stubs.factory';
import { map } from '../../../../utils';
import { facetsNextXStoreModule } from '../module';
import { FacetsNextState } from '../types';
import { resetFacetsStateWith } from './utils';

describe('testing facets module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(facetsNextXStoreModule.getters, getter => getter);
  const store: Store<FacetsNextState> = new Store(facetsNextXStoreModule as any);

  describe(`${gettersKeys.selectedFilters} getter`, () => {
    it('returns an empty array if there are no filters', () => {
      resetFacetsStateWith(store, {});

      expect(store.getters[gettersKeys.selectedFilters]).toEqual([]);
    });

    it('returns an array containing the selected filters', () => {
      resetFacetsStateWith(store, {
        filters: {
          ['color:red']: createSimpleFilter('color', 'Red', false),
          ['color:blue']: createSimpleFilter('color', 'Blue', true),
          ['category:summer']: createHierarchicalFilter('category', 'Summer', false),
          ['category:shorts']: createHierarchicalFilter('category', 'Shorts', true),
          ['price:0-25']: createNumberRangeFilter('price', { min: 0, max: 25 }, false),
          ['price:25-50']: createNumberRangeFilter('price', { min: 25, max: 50 }, true),
          // Raw filters are always selected, but shouldn't be returned in this getter.
          ['size:xl']: createRawFilter('size:xl')
        }
      });

      expect(store.getters[gettersKeys.selectedFilters]).toEqual(
        expect.arrayContaining([
          store.state.filters['color:blue'],
          store.state.filters['category:shorts'],
          store.state.filters['price:25-50']
        ])
      );
    });

    it('returns selected simple filters', () => {
      resetFacetsStateWith(store, {
        filters: {
          ['color:red']: createSimpleFilter('color', 'Red', false),
          ['color:blue']: createSimpleFilter('color', 'Blue', true)
        }
      });

      expect.arrayContaining([store.state.filters['color:blue']]);
    });

    it('returns selected hierarchical filters', () => {
      resetFacetsStateWith(store, {
        filters: {
          ['category:summer']: createHierarchicalFilter('category', 'Summer', false),
          ['category:shorts']: createHierarchicalFilter('category', 'Shorts', true)
        }
      });

      expect.arrayContaining([store.state.filters['category:shorts']]);
    });

    it('returns selected number range filters', () => {
      resetFacetsStateWith(store, {
        filters: {
          ['price:0-25']: createNumberRangeFilter('price', { min: 0, max: 25 }, false),
          ['price:25-50']: createNumberRangeFilter('price', { min: 25, max: 50 }, true)
        }
      });

      expect.arrayContaining([store.state.filters['price:25-50']]);
    });
  });

  describe(`${gettersKeys.filtersByFacet} getter`, () => {
    it('returns an empty object if there are no facets', () => {
      resetFacetsStateWith(store, {});

      expect(store.getters[gettersKeys.filtersByFacet]).toEqual({});
    });

    it('returns an object containing all the filters indexed by its facet', () => {
      const redColor = createSimpleFilter('color', 'Red', false);
      const blueColor = createSimpleFilter('color', 'Blue', true);
      const summerCategory = createHierarchicalFilter('category', 'Summer', false);
      const shortsCategory = createHierarchicalFilter('category', 'Shorts', true);
      const price0To25 = createNumberRangeFilter('price', { min: 0, max: 25 }, false);
      const price25To50 = createNumberRangeFilter('price', { min: 25, max: 50 }, true);
      // Raw filters are always selected, but shouldn't be returned in this getter.
      const sizeXL = createRawFilter('size:xl');
      resetFacetsStateWith(store, {
        filters: {
          ['color:red']: redColor,
          ['color:blue']: blueColor,
          ['category:summer']: summerCategory,
          ['category:shorts']: shortsCategory,
          ['price:0-25']: price0To25,
          ['price:25-50']: price25To50,
          // Raw filters don't have any facet
          ['size:xl']: sizeXL
        }
      });

      expect(store.getters[gettersKeys.filtersByFacet]).toEqual({
        color: [redColor, blueColor],
        category: [summerCategory, shortsCategory],
        price: [price0To25, price25To50]
      });
    });
  });

  it('returns a record containing the simple filters indexed by its id', () => {
    const redColor = createSimpleFilter('color', 'Red', false);
    const blueColor = createSimpleFilter('color', 'Blue', true);

    resetFacetsStateWith(store, {
      filters: {
        ['color:red']: redColor,
        ['color:blue']: blueColor
      }
    });

    expect(store.getters[gettersKeys.filtersByFacet]).toEqual({
      color: [redColor, blueColor]
    });
  });

  it('returns a record containing the hierarchical filters indexed by its id', () => {
    const summerCategory = createHierarchicalFilter('category', 'Summer', false);
    const shortsCategory = createHierarchicalFilter('category', 'Shorts', true);

    resetFacetsStateWith(store, {
      filters: {
        ['category:summer']: summerCategory,
        ['category:shorts']: shortsCategory
      }
    });

    expect(store.getters[gettersKeys.filtersByFacet]).toEqual({
      category: [summerCategory, shortsCategory]
    });
  });

  it('returns a record containing the number range filters indexed by its id', () => {
    const price0To25 = createNumberRangeFilter('price', { min: 0, max: 25 }, false);
    const price25To50 = createNumberRangeFilter('price', { min: 25, max: 50 }, true);

    resetFacetsStateWith(store, {
      filters: {
        ['price:0-25']: price0To25,
        ['price:25-50']: price25To50
      }
    });

    expect(store.getters[gettersKeys.filtersByFacet]).toEqual({
      price: [price0To25, price25To50]
    });
  });
});
