import { deepMerge } from '@empathybroker/deep-merge';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { DeepPartial, map } from '../../../../utils';
import { popularSearchesXStoreModule } from '../module';
import { PopularSearchesState } from '../types';

describe('testing popular searches module getters', () => {
  Vue.use(Vuex);
  const getters = map(popularSearchesXStoreModule.getters, getter => getter);
  const store: Store<PopularSearchesState> = new Store(popularSearchesXStoreModule as any);

  function resetStateWith(state: DeepPartial<PopularSearchesState>): void {
    const newState = deepMerge(popularSearchesXStoreModule.state(), state);
    store.replaceState(newState);
  }

  describe(`${getters.request} getter`, () => {
    it('should return a request object with config default values', () => {
      resetStateWith({ config: { maxItemsToRender: 3 } });
      expect(store.getters[getters.request]).toEqual({ rows: 3, start: 0 });
    });
  });
});
