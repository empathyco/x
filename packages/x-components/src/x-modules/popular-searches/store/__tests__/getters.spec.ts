import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { popularSearchesXStoreModule } from '../module';
import { PopularSearchesState } from '../types';
import { resetPopularSearchesStateWith } from './utils';

describe('testing popular searches module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(popularSearchesXStoreModule.getters, getter => getter);
  const store: Store<PopularSearchesState> = new Store(popularSearchesXStoreModule as any);

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object with config default values', () => {
      resetPopularSearchesStateWith(store, { config: { maxItemsToRender: 3 } });
      expect(store.getters[gettersKeys.request]).toEqual({ rows: 3, start: 0 });
    });
  });
});
