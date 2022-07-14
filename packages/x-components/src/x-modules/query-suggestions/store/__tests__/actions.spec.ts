import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getQuerySuggestionsStub } from '../../../../__stubs__/query-suggestions-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { querySuggestionsXStoreModule } from '../module';
import {
  QuerySuggestionsActions,
  QuerySuggestionsGetters,
  QuerySuggestionsMutations,
  QuerySuggestionsState
} from '../types';
import { resetQuerySuggestionsStateWith } from './utils';

describe('testing query suggestions module actions', () => {
  const mockedSuggestions = getQuerySuggestionsStub('milk');

  const adapter = getMockedAdapter({
    querySuggestions: { suggestions: mockedSuggestions }
  });

  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: SafeStore<
    QuerySuggestionsState,
    QuerySuggestionsGetters,
    QuerySuggestionsMutations,
    QuerySuggestionsActions
  > = new Store(querySuggestionsXStoreModule as any);
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetQuerySuggestionsStateWith(store, { query: '' });
  });

  describe('fetchSuggestions', () => {
    it('should return suggestions if there is request', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'luichito' });

      const suggestions = await store.dispatch('fetchSuggestions', store.getters.request);
      expect(suggestions).toEqual(mockedSuggestions);
    });

    it('should return empty array if there is not request', async () => {
      const suggestions = await store.dispatch('fetchSuggestions', store.getters.request);
      expect(suggestions).toEqual([]);
    });
  });

  describe('fetchAndSaveSuggestions', () => {
    it('should request and store suggestions in the state', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'luichito' });

      const actionPromise = store.dispatch('fetchAndSaveSuggestions', store.getters.request);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.suggestions).toEqual(mockedSuggestions);
      expect(store.state.status).toEqual('success');
    });

    it('should clear suggestions in the state if the query is empty', async () => {
      await store.dispatch('fetchAndSaveSuggestions', store.getters.request);
      expect(store.state.suggestions).toEqual([]);
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'chorizo' });
      const initialQuerySuggestions = store.state.suggestions;
      adapter.querySuggestions.mockResolvedValueOnce({
        suggestions: mockedSuggestions.slice(0, 1)
      });

      const firstRequest = store.dispatch('fetchAndSaveSuggestions', store.getters.request);
      const secondRequest = store.dispatch('fetchAndSaveSuggestions', store.getters.request);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.suggestions).toBe(initialQuerySuggestions);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.suggestions).toEqual(mockedSuggestions);
    });

    it('should set the status to error when it fails', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'lego' });
      adapter.querySuggestions.mockRejectedValueOnce('Generic error');
      const suggestions = store.state.suggestions;
      await store.dispatch('fetchAndSaveSuggestions', store.getters.request);

      expect(store.state.suggestions).toBe(suggestions);
      expect(store.state.status).toEqual('error');
    });
  });

  describe('cancelFetchAndSaveSuggestions', () => {
    it('should cancel the request and do not modify the stored suggestions', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'luichito' });
      const previousSuggestions = store.state.suggestions;
      await Promise.all([
        store.dispatch('fetchAndSaveSuggestions', store.getters.request),
        store.dispatch('cancelFetchAndSaveSuggestions')
      ]);
      expect(store.state.suggestions).toEqual(previousSuggestions);
      expect(store.state.status).toEqual('success');
    });
  });
});
