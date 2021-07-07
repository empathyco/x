import { Filter } from '@empathyco/x-types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import {
  createEditableNumberRangeFacetStub,
  createNumberRangeFacet,
  createSimpleFacetStub
} from '../../../../__stubs__/facets-stubs.factory';
import { facetsXStoreModule } from '../module';
import { FacetsState, MultiSelectChange } from '../types';
import { resetFacetsStateWith } from './utils';

describe('testing facets module actions', () => {
  Vue.use(Vuex);
  const actionsKeys = map(facetsXStoreModule.actions, action => action);
  const gettersKeys = map(facetsXStoreModule.getters, getter => getter);
  const store: Store<FacetsState> = new Store(facetsXStoreModule as any);
  const mutationKeys = map(facetsXStoreModule.mutations, mutation => mutation);

  function getSelectedFilters(): Filter[] {
    return store.getters[gettersKeys.selectedFilters];
  }

  beforeEach(() => {
    resetFacetsStateWith(store, {
      backendFacets: {
        category: createSimpleFacetStub('category', createSimpleFilter => [
          createSimpleFilter('Man', false),
          createSimpleFilter('Woman', true)
        ]),
        color: createSimpleFacetStub('color', createSimpleFilter => [
          createSimpleFilter('Red', false),
          createSimpleFilter('Blue', true)
        ]),
        price: createNumberRangeFacet('price', createNumberRangeFilter => [
          createNumberRangeFilter({ min: 1, max: 10 }, false),
          createNumberRangeFilter({ min: 2, max: 20 }, true)
        ]),
        age: createEditableNumberRangeFacetStub('age', createEditableNumberRangeFilter => [
          createEditableNumberRangeFilter('custom', { min: null, max: null }),
          createEditableNumberRangeFilter('junior', { min: 6, max: 12 })
        ])
      }
    });
  });

  describe(`testing ${actionsKeys.clearSelectedFilters} action`, () => {
    it('clears all the selected filters', async () => {
      expect(getSelectedFilters().length).toBeGreaterThan(0);
      await store.dispatch(actionsKeys.clearSelectedFilters);
      expect(getSelectedFilters()).toEqual([]);
    });
  });

  describe(`testing ${actionsKeys.clearFacetsSelectedFilters} action`, () => {
    it('clears only the selected filters for the provided facet ids', async () => {
      expect(getSelectedFilters().length).toBeGreaterThan(1);
      const [, colorSelectedFilter] = store.getters.facets.color.filters;
      const [, priceSelectedFilter] = store.getters.facets.price.filters;
      const [, ageSelectedFilter] = store.getters.facets.age.filters;
      await store.dispatch(actionsKeys.clearFacetsSelectedFilters, ['category']);
      expect(getSelectedFilters()).toEqual([
        colorSelectedFilter,
        priceSelectedFilter,
        ageSelectedFilter
      ]);
      await store.dispatch(actionsKeys.clearFacetsSelectedFilters, ['age']);
      expect(getSelectedFilters()).toEqual([colorSelectedFilter, priceSelectedFilter]);
    });
  });

  describe(`testing ${actionsKeys.toggleSimpleFilter} action`, () => {
    it('toggles a filter deselecting their siblings if multiselect is disabled', async () => {
      const [colorUnselectedFilter] = store.getters.facets.color.filters;
      const [, categorySelectedFilter] = store.getters.facets.category.filters;
      const [, priceSelectedFilter] = store.getters.facets.price.filters;
      const [, ageSelectedFilter] = store.getters.facets.age.filters;

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);
      expect(getSelectedFilters()).toHaveLength(4);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorUnselectedFilter,
        priceSelectedFilter,
        ageSelectedFilter
      ]);

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        priceSelectedFilter,
        ageSelectedFilter
      ]);
    });

    it('toggles a filter keeping its siblings selected if multiselect is enabled', async () => {
      const [colorUnselectedFilter, colorSelectedFilter] = store.getters.facets.color.filters;
      const [, categorySelectedFilter] = store.getters.facets.category.filters;
      const [, priceSelectedFilter] = store.getters.facets.price.filters;
      const [, ageSelectedFilter] = store.getters.facets.age.filters;

      store.commit(mutationKeys.setFacetMultiSelect, <MultiSelectChange>{
        facetId: 'color',
        multiSelect: true
      });

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);
      expect(getSelectedFilters()).toHaveLength(5);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorUnselectedFilter,
        colorSelectedFilter,
        priceSelectedFilter,
        ageSelectedFilter
      ]);

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);
      expect(getSelectedFilters()).toHaveLength(4);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorSelectedFilter,
        priceSelectedFilter,
        ageSelectedFilter
      ]);
    });
  });

  describe(`testing ${actionsKeys.toggleNumberRangeFilter} action`, () => {
    it('toggles a filter deselecting their siblings if multiselect is disabled', async () => {
      const [, colorSelectedFilter] = store.getters.facets.color.filters;
      const [, categorySelectedFilter] = store.getters.facets.category.filters;
      const [priceUnselectedFilter] = store.getters.facets.price.filters;
      const [, ageSelectedFilter] = store.getters.facets.age.filters;

      await store.dispatch(actionsKeys.toggleNumberRangeFilter, priceUnselectedFilter);

      expect(getSelectedFilters()).toHaveLength(4);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorSelectedFilter,
        priceUnselectedFilter,
        ageSelectedFilter
      ]);

      await store.dispatch(actionsKeys.toggleNumberRangeFilter, priceUnselectedFilter);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorSelectedFilter,
        ageSelectedFilter
      ]);
    });

    it('toggles a filter keeping its siblings selected if multiselect is enabled', async () => {
      const [, colorSelectedFilter] = store.getters.facets.color.filters;
      const [, categorySelectedFilter] = store.getters.facets.category.filters;
      const [priceUnselectedFilter, priceSelectedFilter] = store.getters.facets.price.filters;
      const [, ageSelectedFilter] = store.getters.facets.age.filters;

      store.commit(mutationKeys.setFacetMultiSelect, <MultiSelectChange>{
        facetId: 'price',
        multiSelect: true
      });

      await store.dispatch(actionsKeys.toggleNumberRangeFilter, priceUnselectedFilter);

      expect(getSelectedFilters()).toHaveLength(5);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorSelectedFilter,
        priceUnselectedFilter,
        priceSelectedFilter,
        ageSelectedFilter
      ]);

      await store.dispatch(actionsKeys.toggleNumberRangeFilter, priceUnselectedFilter);
      expect(getSelectedFilters()).toHaveLength(4);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorSelectedFilter,
        priceSelectedFilter,
        ageSelectedFilter
      ]);
    });
  });
});
