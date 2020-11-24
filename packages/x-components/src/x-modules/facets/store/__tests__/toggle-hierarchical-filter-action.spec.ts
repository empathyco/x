import { Filter, HierarchicalFacet, SimpleFacet } from '@empathy/search-types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils/object';
import {
  createHierarchicalFacetStub,
  createSimpleFacetStub
} from '../../../../__stubs__/facets-stubs.factory';
import { facetsXStoreModule } from '../module';
import { FacetsState } from '../types';
import { resetFacetsStateWith } from './utils';

describe(`testing toggleHierarchicalFilter`, () => {
  Vue.use(Vuex);
  const store = new Store<FacetsState>(facetsXStoreModule as any);
  const actionsKeys = map(facetsXStoreModule.actions, action => action);
  const gettersKeys = map(facetsXStoreModule.getters, getter => getter);

  function getSelectedFilters(): Filter[] {
    return store.getters[gettersKeys.selectedFilters];
  }

  /**
   * Creates a color facet, which is used to ensure that no other facets filters are mutated in the
   * action, apart from the target one.
   *
   * @returns A Simple facet with selected filter.
   */
  function createColorFacet(): SimpleFacet {
    return createSimpleFacetStub('color', createSimpleFilter => [
      createSimpleFilter('Red', false),
      createSimpleFilter('Blue', true)
    ]);
  }

  describe('when the facet is NOT multi-selectable', () => {
    it('selects all filter ancestors when a child is selected', () => {
      resetFacetsStateWith(store, {
        facets: {
          category: createHierarchicalFacetStub('Category', createFilter => [
            createFilter('Men', false, createFilter => [
              createFilter('Men shirts', false, createFilter => [
                createFilter('Men long sleeve shirts', false),
                createFilter('Men short sleeve shirts', false)
              ]),
              createFilter('Men jeans', false)
            ]),
            createFilter('Women', true)
          ]),
          color: createColorFacet()
        }
      });

      const category = store.state.facets.category as HierarchicalFacet;
      const [men] = category.filters;
      const [menShirts] = men.children;
      const [menLongSleeveShirts] = menShirts.children;
      const [, blue] = store.state.facets.color.filters;

      store.dispatch(actionsKeys.toggleHierarchicalFilter, menLongSleeveShirts);

      expect(getSelectedFilters()).toHaveLength(4);
      expect(getSelectedFilters()).toEqual(
        expect.arrayContaining([men, menShirts, menLongSleeveShirts, blue])
      );
    });

    it('deselects all filter children when a child is deselected', () => {
      resetFacetsStateWith(store, {
        facets: {
          category: createHierarchicalFacetStub('Category', createFilter => [
            createFilter('Men', true, createFilter => [
              createFilter('Men shirts', true, createFilter => [
                createFilter('Men long sleeve shirts', true, createFilter => [
                  createFilter('Fall men long sleeve shirts', true)
                ]),
                createFilter('Men short sleeve shirts', false)
              ]),
              createFilter('Men jeans', true)
            ]),
            createFilter('Women', true)
          ]),
          color: createColorFacet()
        }
      });

      const category = store.state.facets.category as HierarchicalFacet;
      const [men] = category.filters;
      const [menShirts] = men.children;
      const [, blue] = store.state.facets.color.filters;

      store.dispatch(actionsKeys.toggleHierarchicalFilter, menShirts);

      expect(getSelectedFilters()).toHaveLength(2);
      expect(getSelectedFilters()).toEqual(expect.arrayContaining([men, blue]));
    });
  });

  describe('when the facet is multi-selectable', () => {
    beforeEach(() => {
      resetFacetsStateWith(store, {
        config: {
          multiSelect: {
            category: true
          }
        },
        facets: {
          category: createHierarchicalFacetStub('Category', createFilter => [
            createFilter('Men', true, createFilter => [
              createFilter('Men shirts', true, createFilter => [
                createFilter('Men long sleeve shirts', true),
                createFilter('Men short sleeve shirts', false)
              ]),
              createFilter('Men jeans', true)
            ]),
            createFilter('Women', true)
          ]),
          color: createColorFacet()
        }
      });
    });

    it('selects the toggled filter and keeps its siblings when it is multi-selectable', () => {
      const category = store.state.facets.category as HierarchicalFacet;
      const [men, women] = category.filters;
      const [menShirts, menJeans] = men.children;
      const [menLongSleeveShirts, menShortSleeveShirts] = menShirts.children;
      const [, blue] = store.state.facets.color.filters;

      store.dispatch(actionsKeys.toggleHierarchicalFilter, menShortSleeveShirts);

      expect(getSelectedFilters()).toHaveLength(7);
      expect(getSelectedFilters()).toEqual(
        expect.arrayContaining([
          men,
          menShirts,
          menLongSleeveShirts,
          menShortSleeveShirts,
          menJeans,
          women,
          blue
        ])
      );
    });

    it('deselects the toggled filter and keeps its siblings when it is multi-selectable', () => {
      const category = store.state.facets.category as HierarchicalFacet;
      const [men, women] = category.filters;
      const [menShirts, menJeans] = men.children;
      const [, blue] = store.state.facets.color.filters;

      store.dispatch(actionsKeys.toggleHierarchicalFilter, menShirts);

      expect(getSelectedFilters()).toHaveLength(4);
      expect(getSelectedFilters()).toEqual(expect.arrayContaining([men, menJeans, women, blue]));
    });
  });
});
