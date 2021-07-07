import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { recommendationsXStoreModule } from '../module';
import { RecommendationsState } from '../types';

describe('testing recommendations module actions', () => {
  const mockedResults = getResultsStub();

  const adapter = getMockedAdapter({ topRecommendations: { results: mockedResults } });

  const actionKeys = map(recommendationsXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store: Store<RecommendationsState> = new Store(recommendationsXStoreModule as any);
  installNewXPlugin({ store, adapter }, localVue);

  describe(`${actionKeys.fetchRecommendations}`, () => {
    it('should return recommendations', async () => {
      const suggestions = await store.dispatch(actionKeys.fetchRecommendations);
      expect(suggestions).toEqual(mockedResults);
    });
  });

  describe(`${actionKeys.fetchAndSaveRecommendations}`, () => {
    it('should request and store recommendations in the state', async () => {
      const actionPromise = store.dispatch(actionKeys.fetchAndSaveRecommendations);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.recommendations).toEqual(mockedResults);
      expect(store.state.status).toEqual('success');
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      const initialRecommendations = store.state.recommendations;
      adapter.getTopRecommendations.mockResolvedValueOnce({ results: mockedResults.slice(0, 1) });

      const firstRequest = store.dispatch(actionKeys.fetchAndSaveRecommendations);
      const secondRequest = store.dispatch(actionKeys.fetchAndSaveRecommendations);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.recommendations).toBe(initialRecommendations);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.recommendations).toEqual(initialRecommendations);
    });

    it('should set the status to error when it fails', async () => {
      adapter.getTopRecommendations.mockRejectedValueOnce('Generic error');
      const recommendations = store.state.recommendations;
      await store.dispatch(actionKeys.fetchAndSaveRecommendations);

      expect(store.state.recommendations).toBe(recommendations);
      expect(store.state.status).toEqual('error');
    });
  });

  describe(`${actionKeys.cancelFetchAndSaveRecommendations}`, () => {
    it('should cancel the request and do not modify the stored recommendations', async () => {
      const previousRecommendations = store.state.recommendations;
      await Promise.all([
        store.dispatch(actionKeys.fetchAndSaveRecommendations),
        store.dispatch(actionKeys.cancelFetchAndSaveRecommendations)
      ]);
      expect(store.state.recommendations).toEqual(previousRecommendations);
      expect(store.state.status).toEqual('success');
    });
  });
});
