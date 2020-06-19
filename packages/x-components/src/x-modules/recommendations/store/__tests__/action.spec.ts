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
      await store.dispatch(actionKeys.fetchAndSaveRecommendations);
      expect(store.state.recommendations).toEqual(mockedResults);
    });
  });
});
