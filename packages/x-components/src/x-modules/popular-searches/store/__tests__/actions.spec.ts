import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { getSuggestionsStub } from '../../../../__stubs__/suggestions-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { popularSearchesXStoreModule } from '../module';
import { PopularSearchesState } from '../types';

describe('testing popular searches module actions', () => {
  const mockedSuggestions = getSuggestionsStub();
  const adapter = getMockedAdapter({ suggestions: { suggestions: mockedSuggestions } });

  const actionKeys = map(popularSearchesXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: Store<PopularSearchesState> = new Store(popularSearchesXStoreModule as any);
  installNewXPlugin({ store, adapter }, localVue);

  describe(`${actionKeys.fetchSuggestions}`, () => {
    it('should return suggestions', async () => {
      const suggestions = await store.dispatch(actionKeys.fetchSuggestions);
      expect(suggestions).toEqual(mockedSuggestions);
    });
  });

  describe(`${actionKeys.fetchAndSaveSuggestions}`, () => {
    it('should request and store suggestions in the state', async () => {
      const actionPromise = store.dispatch(actionKeys.fetchAndSaveSuggestions);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.popularSearches).toEqual(mockedSuggestions);
      expect(store.state.status).toEqual('success');
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      const initialPopularSearches = store.state.popularSearches;
      adapter.getSuggestions.mockResolvedValueOnce({ suggestions: mockedSuggestions.slice(0, 1) });

      const firstRequest = store.dispatch(actionKeys.fetchAndSaveSuggestions);
      const secondRequest = store.dispatch(actionKeys.fetchAndSaveSuggestions);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.popularSearches).toBe(initialPopularSearches);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.popularSearches).toEqual(mockedSuggestions);
    });

    it('should set the status to error when it fails', async () => {
      adapter.getSuggestions.mockRejectedValueOnce('Generic error');
      const popularSearches = store.state.popularSearches;
      await store.dispatch(actionKeys.fetchAndSaveSuggestions);

      expect(store.state.popularSearches).toBe(popularSearches);
      expect(store.state.status).toEqual('error');
    });
  });

  describe(`${actionKeys.cancelFetchAndSaveSuggestions}`, () => {
    it('should cancel the request and do not modify stored popular searches', async () => {
      const previousPopularSearches = store.state.popularSearches;
      await Promise.all([
        store.dispatch(actionKeys.fetchAndSaveSuggestions),
        store.dispatch(actionKeys.cancelFetchAndSaveSuggestions)
      ]);
      expect(store.state.popularSearches).toEqual(previousPopularSearches);
      expect(store.state.status).toEqual('success');
    });
  });
});
