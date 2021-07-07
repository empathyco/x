import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { RECOMMENDATIONS_ORIGIN } from '../constants';
import { recommendationsXStoreModule } from '../module';
import { RecommendationsState } from '../types';
import { resetRecommendationsStateWith } from './utils';

describe('testing recommendations module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(recommendationsXStoreModule.getters, getter => getter);
  const store: Store<RecommendationsState> = new Store(recommendationsXStoreModule as any);

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object with config default values', () => {
      resetRecommendationsStateWith(store, { config: { maxItemsToRequest: 3 } });
      expect(store.getters[gettersKeys.request]).toEqual({
        rows: 3,
        start: 0,
        origin: RECOMMENDATIONS_ORIGIN
      });
    });
  });
});
