import { Filter } from '@empathy/search-types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils/object';
import { createSimpleFacetStub } from '../../../../__stubs__/facets-stubs.factory';
import { MultiSelectChange } from '../../events.types';
import { facetsXStoreModule } from '../module';
import { FacetsState } from '../types';
import { resetFacetsStateWith } from './utils';

describe('testing facets module actions', () => {
  Vue.use(Vuex);
  const store = new Store<FacetsState>(facetsXStoreModule as any);
  const actionsKeys = map(facetsXStoreModule.actions, action => action);
  const gettersKeys = map(facetsXStoreModule.getters, getter => getter);
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
      const [, colorSelectedFilter] = store.state.facets.color.filters;
      await store.dispatch(actionsKeys.clearFacetsSelectedFilters, ['category']);
      expect(getSelectedFilters()).toEqual([colorSelectedFilter]);
    });
  });

  describe(`testing ${actionsKeys.toggleSimpleFilter} action`, () => {
    it('toggles a filter deselecting their siblings if multiselect is disabled', async () => {
      const [colorUnselectedFilter] = store.state.facets.color.filters;
      const [, categorySelectedFilter] = store.state.facets.category.filters;

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);

      expect(getSelectedFilters()).toHaveLength(2);
      expect(getSelectedFilters()).toEqual(
        expect.arrayContaining([colorUnselectedFilter, categorySelectedFilter])
      );

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);
      expect(getSelectedFilters()).toEqual([categorySelectedFilter]);
    });

    it('toggles a filter keeping its siblings selected if multiselect is enabled', async () => {
      const [colorUnselectedFilter, colorSelectedFilter] = store.state.facets.color.filters;
      const [, categorySelectedFilter] = store.state.facets.category.filters;
      store.commit(mutationKeys.setFacetMultiSelect, <MultiSelectChange>{
        facetId: 'color',
        multiSelect: true
      });

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);

      expect(getSelectedFilters()).toHaveLength(3);
      expect(getSelectedFilters()).toEqual(
        expect.arrayContaining([colorUnselectedFilter, colorSelectedFilter, categorySelectedFilter])
      );

      await store.dispatch(actionsKeys.toggleSimpleFilter, colorUnselectedFilter);
      expect(getSelectedFilters()).toHaveLength(2);
      expect(getSelectedFilters()).toEqual(
        expect.arrayContaining([categorySelectedFilter, categorySelectedFilter])
      );
    });
  });
});
