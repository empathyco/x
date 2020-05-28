import { RecommendationsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the recommendations module.
 *
 * @internal
 */
export const recommendationsXStoreModule: RecommendationsXStoreModule = {
  state: () => ({
    config: {
      maxItemsToRequest: 5
    }
  }),
  getters: {},
  mutations: {},
  actions: {}
};
