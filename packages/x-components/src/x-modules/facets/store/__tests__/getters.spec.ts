import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { getFacetsStub } from '../../../../__stubs__/facets-stubs.factory';
import { facetsXStoreModule } from '../module';
import { FacetsState } from '../types';
import { resetFacetsStateWith } from './utils';

describe('testing facets module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(facetsXStoreModule.getters, getter => getter);
  const store: Store<FacetsState> = new Store(facetsXStoreModule as any);

  beforeEach(() => {
    resetFacetsStateWith(store);
  });

  describe(`${gettersKeys.selectedFilters} getter`, () => {
    it('should be empty', () => {
      resetFacetsStateWith(store, {
        facets: getFacetsStub()
      });

      expect(store.getters.selectedFilters).toHaveLength(0);
    });
  });
});
