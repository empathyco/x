import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getPopularSearchesStub } from '../../../../__stubs__/popular-searches-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { popularSearchesXStoreModule } from '../module';
import {
  PopularSearchesActions,
  PopularSearchesGetters,
  PopularSearchesMutations,
  PopularSearchesState
} from '../types';

describe('testing popular searches module actions', () => {
  const mockedSuggestions = getPopularSearchesStub();
  const adapter = getMockedAdapter({ popularSearches: { suggestions: mockedSuggestions } });

  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: SafeStore<
    PopularSearchesState,
    PopularSearchesGetters,
    PopularSearchesMutations,
    PopularSearchesActions
  > = new Store(popularSearchesXStoreModule as any);
  installNewXPlugin({ store, adapter }, localVue);

  describe('fetchSuggestions', () => {
    it('should return suggestions', async () => {
      const suggestions = await store.dispatch('fetchSuggestions', store.getters.request);
      expect(suggestions).toEqual(mockedSuggestions);
    });
  });

  describe('fetchAndSaveSuggestions', () => {
    it('should request and store suggestions in the state', async () => {
      const actionPromise = store.dispatch('fetchAndSaveSuggestions', store.getters.request);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.popularSearches).toEqual(mockedSuggestions);
      expect(store.state.status).toEqual('success');
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      const initialPopularSearches = store.state.popularSearches;
      adapter.popularSearches.mockResolvedValueOnce({
        suggestions: mockedSuggestions.slice(0, 1)
      });

      const firstRequest = store.dispatch('fetchAndSaveSuggestions', store.getters.request);
      const secondRequest = store.dispatch('fetchAndSaveSuggestions', store.getters.request);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.popularSearches).toBe(initialPopularSearches);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.popularSearches).toEqual(mockedSuggestions);
    });

    it('should set the status to error when it fails', async () => {
      adapter.popularSearches.mockRejectedValueOnce('Generic error');
      const popularSearches = store.state.popularSearches;
      await store.dispatch('fetchAndSaveSuggestions', store.getters.request);

      expect(store.state.popularSearches).toBe(popularSearches);
      expect(store.state.status).toEqual('error');
    });
  });

  describe('cancelFetchAndSaveSuggestions', () => {
    it('should cancel the request and do not modify stored popular searches', async () => {
      const previousPopularSearches = store.state.popularSearches;
      await Promise.all([
        store.dispatch('fetchAndSaveSuggestions', store.getters.request),
        store.dispatch('cancelFetchAndSaveSuggestions')
      ]);
      expect(store.state.popularSearches).toEqual(previousPopularSearches);
      expect(store.state.status).toEqual('success');
    });
  });
});
