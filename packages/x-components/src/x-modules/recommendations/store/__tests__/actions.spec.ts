import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { recommendationsXStoreModule } from '../module';
import {
  RecommendationsActions,
  RecommendationsGetters,
  RecommendationsMutations,
  RecommendationsState
} from '../types';

describe('testing recommendations module actions', () => {
  const mockedResults = getResultsStub();

  const adapter = getMockedAdapter({ recommendations: { results: mockedResults } });

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store: SafeStore<
    RecommendationsState,
    RecommendationsGetters,
    RecommendationsMutations,
    RecommendationsActions
  > = new Store(recommendationsXStoreModule as any);
  installNewXPlugin({ store, adapter }, localVue);

  describe('fetchRecommendations', () => {
    it('should return recommendations', async () => {
      const suggestions = await store.dispatch('fetchRecommendations', store.getters.request);
      expect(suggestions).toEqual(mockedResults);
    });
  });

  describe('fetchAndSaveRecommendations', () => {
    it('should request and store recommendations in the state', async () => {
      const actionPromise = store.dispatch('fetchAndSaveRecommendations', store.getters.request);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.recommendations).toEqual(mockedResults);
      expect(store.state.status).toEqual('success');
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      const initialRecommendations = store.state.recommendations;
      adapter.recommendations.mockResolvedValueOnce({ results: mockedResults.slice(0, 1) });

      const firstRequest = store.dispatch('fetchAndSaveRecommendations', store.getters.request);
      const secondRequest = store.dispatch('fetchAndSaveRecommendations', store.getters.request);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.recommendations).toBe(initialRecommendations);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.recommendations).toEqual(initialRecommendations);
    });

    it('should set the status to error when it fails', async () => {
      adapter.recommendations.mockRejectedValueOnce('Generic error');
      const recommendations = store.state.recommendations;
      await store.dispatch('fetchAndSaveRecommendations', store.getters.request);

      expect(store.state.recommendations).toBe(recommendations);
      expect(store.state.status).toEqual('error');
    });
  });

  describe('cancelFetchAndSaveRecommendations', () => {
    it('should cancel the request and do not modify the stored recommendations', async () => {
      const previousRecommendations = store.state.recommendations;
      await Promise.all([
        store.dispatch('fetchAndSaveRecommendations', store.getters.request),
        store.dispatch('cancelFetchAndSaveRecommendations')
      ]);
      expect(store.state.recommendations).toEqual(previousRecommendations);
      expect(store.state.status).toEqual('success');
    });
  });
});
