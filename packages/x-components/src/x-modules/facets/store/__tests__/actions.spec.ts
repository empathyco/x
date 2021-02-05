import { Filter } from '@empathy/search-types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { arrayToObject, map } from '../../../../utils';
import {
  createHierarchicalFacetStub,
  createNumberRangeFacet,
  createSimpleFacetStub,
  getFacetsStub
} from '../../../../__stubs__/facets-stubs.factory';
import { MultiSelectChange } from '../../events.types';
import { facetsXStoreModule } from '../module';
import { FacetsState } from '../types';
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
      facets: {
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
        ])
      }
    });
  });

  describe(`${actionsKeys.setFacets} action`, () => {
    it('should overwrite newFacets filters selected values with the state ones', () => {
      const initialFacets = getFacetsStub();
      store.dispatch('setFacets', initialFacets);
      expect(store.state.facets).toEqual(arrayToObject(initialFacets, 'id'));
    });

    it('should overwrite new default filters selected values with state values', () => {
      const currentCategoryFacet = createSimpleFacetStub('Category', createCategorySimpleFilter => [
        createCategorySimpleFilter('men', true),
        createCategorySimpleFilter('women', false),
        createCategorySimpleFilter('home', false)
      ]);

      const newCategoryFacet = createSimpleFacetStub('Category', createCategorySimpleFilter => [
        createCategorySimpleFilter('men', false),
        createCategorySimpleFilter('women', true),
        createCategorySimpleFilter('kid', true)
      ]);

      resetFacetsStateWith(store, {
        facets: { category: currentCategoryFacet }
      });
      store.dispatch(actionsKeys.setFacets, [newCategoryFacet]);

      const flattenedFilters = store.getters[gettersKeys.flattenedFilters];
      expect(flattenedFilters['category:men'].selected).toEqual(true);
      expect(flattenedFilters['category:women'].selected).toEqual(false);
      expect(flattenedFilters['category:home']).toBeUndefined();
      expect(flattenedFilters['category:kid'].selected).toEqual(false);
    });

    it('should overwrite new hierarchical filters selected values with state values', () => {
      const currentCategoryFacet = createHierarchicalFacetStub(
        'Category',
        createHierarchicalFilter => [
          createHierarchicalFilter('men', true, createHierarchicalFilter => [
            createHierarchicalFilter('shirts', true, createHierarchicalFilter => [
              createHierarchicalFilter('striped', true)
            ])
          ]),
          createHierarchicalFilter('women', false),
          createHierarchicalFilter('home', false)
        ]
      );

      const newCategoryFacet = createHierarchicalFacetStub('Category', createHierarchicalFilter => [
        createHierarchicalFilter('men', false, createHierarchicalFilter => [
          createHierarchicalFilter('shirts', false, createHierarchicalFilter => [
            createHierarchicalFilter('striped', false)
          ])
        ]),
        createHierarchicalFilter('women', true, createHierarchicalFilter => [
          createHierarchicalFilter('shoes', true, createHierarchicalFilter => [
            createHierarchicalFilter('sport', true)
          ])
        ]),
        createHierarchicalFilter('kid', true)
      ]);

      resetFacetsStateWith(store, {
        facets: { category: currentCategoryFacet }
      });
      store.dispatch(actionsKeys.setFacets, [newCategoryFacet]);

      const flattenedFilters = store.getters[gettersKeys.flattenedFilters];
      expect(flattenedFilters['category:men'].selected).toEqual(true);
      expect(flattenedFilters['category:shirts'].selected).toEqual(true);
      expect(flattenedFilters['category:striped'].selected).toEqual(true);
      expect(flattenedFilters['category:women'].selected).toEqual(false);
      expect(flattenedFilters['category:shoes'].selected).toEqual(false);
      expect(flattenedFilters['category:sport'].selected).toEqual(false);
      expect(flattenedFilters['category:home']).toBeUndefined();
      expect(flattenedFilters['category:kid'].selected).toEqual(false);
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
      const [, colorSelectedFilter] = store.state.facets.color.filters;
      const [, priceSelectedFilter] = store.state.facets.price.filters;
      await store.dispatch(actionsKeys.clearFacetsSelectedFilters, ['category']);
      expect(getSelectedFilters()).toEqual([colorSelectedFilter, priceSelectedFilter]);
    });
  });

  describe(`testing ${actionsKeys.toggleSimpleFilter} action`, () => {
    it('toggles a filter deselecting their siblings if multiselect is disabled', async () => {
      const [colorUnselectedFilter] = store.state.facets.color.filters;
      const [, categorySelectedFilter] = store.state.facets.category.filters;
      const [, priceSelectedFilter] = store.state.facets.price.filters;

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);

      expect(getSelectedFilters()).toHaveLength(3);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorUnselectedFilter,
        priceSelectedFilter
      ]);

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);
      expect(getSelectedFilters()).toEqual([categorySelectedFilter, priceSelectedFilter]);
    });

    it('toggles a filter keeping its siblings selected if multiselect is enabled', async () => {
      const [colorUnselectedFilter, colorSelectedFilter] = store.state.facets.color.filters;
      const [, categorySelectedFilter] = store.state.facets.category.filters;
      const [, priceSelectedFilter] = store.state.facets.price.filters;
      store.commit(mutationKeys.setFacetMultiSelect, <MultiSelectChange>{
        facetId: 'color',
        multiSelect: true
      });

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);

      expect(getSelectedFilters()).toHaveLength(4);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorUnselectedFilter,
        colorSelectedFilter,
        priceSelectedFilter
      ]);

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);
      expect(getSelectedFilters()).toHaveLength(3);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorSelectedFilter,
        priceSelectedFilter
      ]);
    });
  });

  describe(`testing ${actionsKeys.toggleNumberRangeFilter} action`, () => {
    it('toggles a filter deselecting their siblings if multiselect is disabled', async () => {
      const [, colorSelectedFilter] = store.state.facets.color.filters;
      const [, categorySelectedFilter] = store.state.facets.category.filters;
      const [priceUnselectedFilter] = store.state.facets.price.filters;

      await store.dispatch(actionsKeys.toggleNumberRangeFilter, priceUnselectedFilter);

      expect(getSelectedFilters()).toHaveLength(3);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorSelectedFilter,
        priceUnselectedFilter
      ]);

      await store.dispatch(actionsKeys.toggleNumberRangeFilter, priceUnselectedFilter);
      expect(getSelectedFilters()).toEqual([categorySelectedFilter, colorSelectedFilter]);
    });

    it('toggles a filter keeping its siblings selected if multiselect is enabled', async () => {
      const [, colorSelectedFilter] = store.state.facets.color.filters;
      const [, categorySelectedFilter] = store.state.facets.category.filters;
      const [priceUnselectedFilter, priceSelectedFilter] = store.state.facets.price.filters;
      store.commit(mutationKeys.setFacetMultiSelect, <MultiSelectChange>{
        facetId: 'price',
        multiSelect: true
      });

      await store.dispatch(actionsKeys.toggleNumberRangeFilter, priceUnselectedFilter);

      expect(getSelectedFilters()).toHaveLength(4);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorSelectedFilter,
        priceUnselectedFilter,
        priceSelectedFilter
      ]);

      await store.dispatch(actionsKeys.toggleNumberRangeFilter, priceUnselectedFilter);
      expect(getSelectedFilters()).toHaveLength(3);
      expect(getSelectedFilters()).toEqual([
        categorySelectedFilter,
        colorSelectedFilter,
        priceSelectedFilter
      ]);
    });
  });
});
