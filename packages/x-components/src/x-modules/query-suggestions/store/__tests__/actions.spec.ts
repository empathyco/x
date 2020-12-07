import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { getSuggestionsStub } from '../../../../__stubs__/suggestions-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { querySuggestionsXStoreModule } from '../module';
import { QuerySuggestionsState } from '../types';
import { resetQuerySuggestionsStateWith } from './utils';

describe('testing query suggestions module actions', () => {
  const mockedSuggestions = getSuggestionsStub('QuerySuggestion');

  const adapter = getMockedAdapter({ suggestions: { suggestions: mockedSuggestions } });

  const actionKeys = map(querySuggestionsXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: Store<QuerySuggestionsState> = new Store(querySuggestionsXStoreModule as any);
  installNewXPlugin({ store, adapter }, localVue);

  beforeEach(() => {
    resetQuerySuggestionsStateWith(store, { query: '' });
  });

  describe(`${actionKeys.fetchSuggestions}`, () => {
    it('should return suggestions if there is request', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'luichito' });

      const suggestions = await store.dispatch(actionKeys.fetchSuggestions);
      expect(suggestions).toEqual(mockedSuggestions);
    });

    it('should return empty array if there is not request', async () => {
      const suggestions = await store.dispatch(actionKeys.fetchSuggestions);
      expect(suggestions).toEqual([]);
    });
  });

  describe(`${actionKeys.fetchAndSaveSuggestions}`, () => {
    it('should request and store suggestions in the state', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'luichito' });

      const actionPromise = store.dispatch(actionKeys.fetchAndSaveSuggestions);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.suggestions).toEqual(mockedSuggestions);
      expect(store.state.status).toEqual('success');
    });

    it('should clear suggestions in the state if the query is empty', async () => {
      await store.dispatch(actionKeys.fetchAndSaveSuggestions);
      expect(store.state.suggestions).toEqual([]);
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'chorizo' });
      const initialQuerySuggestions = store.state.suggestions;
      adapter.getSuggestions.mockResolvedValueOnce({ suggestions: mockedSuggestions.slice(0, 1) });

      const firstRequest = store.dispatch(actionKeys.fetchAndSaveSuggestions);
      const secondRequest = store.dispatch(actionKeys.fetchAndSaveSuggestions);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.suggestions).toBe(initialQuerySuggestions);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.suggestions).toEqual(mockedSuggestions);
    });

    it('should set the status to error when it fails', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'lego' });
      adapter.getSuggestions.mockRejectedValueOnce('Generic error');
      const suggestions = store.state.suggestions;
      await store.dispatch(actionKeys.fetchAndSaveSuggestions);

      expect(store.state.suggestions).toBe(suggestions);
      expect(store.state.status).toEqual('error');
    });
  });

  describe(`${actionKeys.cancelFetchAndSaveSuggestions}`, () => {
    it('should cancel the request and do not modify the stored suggestions', async () => {
      resetQuerySuggestionsStateWith(store, { query: 'luichito' });
      const previousSuggestions = store.state.suggestions;
      await Promise.all([
        store.dispatch(actionKeys.fetchAndSaveSuggestions),
        store.dispatch(actionKeys.cancelFetchAndSaveSuggestions)
      ]);
      expect(store.state.suggestions).toEqual(previousSuggestions);
      expect(store.state.status).toEqual('success');
    });
  });
});
