import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { identifierResultsXStoreModule } from '../module';
import { IdentifierResultsState } from '../types';
import { resetIdentifierResultsStateWith } from './utils';

describe('testing identifier results module actions', () => {
  const mockedResults = getResultsStub();
  const adapter = getMockedAdapter({ searchById: { results: mockedResults } });

  const actionKeys = map(identifierResultsXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: Store<IdentifierResultsState> = new Store(identifierResultsXStoreModule as any);
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetIdentifierResultsStateWith(store);
  });

  describe(`${actionKeys.fetchIdentifierResults}`, () => {
    it('should return identifier results', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });

      const identifierResults = await store.dispatch(actionKeys.fetchIdentifierResults);
      expect(identifierResults).toEqual(mockedResults);
    });

    it('should return empty array if there is not request', async () => {
      const identifierResults = await store.dispatch(actionKeys.fetchIdentifierResults);
      expect(identifierResults).toEqual([]);
    });
  });

  describe(`${actionKeys.fetchAndSaveIdentifierResults}`, () => {
    it('should request and store identifier results in the state', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });

      const actionPromise = store.dispatch(actionKeys.fetchAndSaveIdentifierResults);
      expect(store.state.status).toEqual('loading');
      await actionPromise;

      expect(store.state.identifierResults).toEqual(mockedResults);
      expect(store.state.status).toEqual('success');
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });
      const initialIdentifierResults = store.state.identifierResults;
      adapter.searchById.mockResolvedValueOnce({ results: mockedResults.slice(0, 1) });

      const firstRequest = store.dispatch(actionKeys.fetchAndSaveIdentifierResults);
      const secondRequest = store.dispatch(actionKeys.fetchAndSaveIdentifierResults);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.identifierResults).toBe(initialIdentifierResults);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.identifierResults).toEqual(mockedResults);
    });

    it('should set the status to error when it fails', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });
      adapter.searchById.mockRejectedValueOnce('Generic error');
      const identifierResults = store.state.identifierResults;
      await store.dispatch(actionKeys.fetchAndSaveIdentifierResults);

      expect(store.state.identifierResults).toBe(identifierResults);
      expect(store.state.status).toEqual('error');
    });
  });

  describe(`${actionKeys.cancelFetchAndSaveIdentifierResults}`, () => {
    it('should cancel the request and do not modify the stored identifier results', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });
      const previousIdentifierResults = store.state.identifierResults;
      await Promise.all([
        store.dispatch(actionKeys.fetchAndSaveIdentifierResults),
        store.dispatch(actionKeys.cancelFetchAndSaveIdentifierResults)
      ]);
      expect(store.state.identifierResults).toEqual(previousIdentifierResults);
      expect(store.state.status).toEqual('success');
    });
  });

  describe(`${actionKeys.saveQuery}`, () => {
    const identifierDetectionRegexp = '^[0-9]{2,}$';
    it('should store the query in the state if it matches the regex', async () => {
      resetIdentifierResultsStateWith(store, { config: { identifierDetectionRegexp } });

      await store.dispatch(actionKeys.saveQuery, '1906');
      expect(store.state.query).toEqual('1906');
    });
    it('should not store query in the state if it matches the regex', async () => {
      resetIdentifierResultsStateWith(store, { config: { identifierDetectionRegexp } });

      await store.dispatch(actionKeys.saveQuery, '1 thousand nine hundred and 6');
      expect(store.state.query).toEqual('');
    });
  });
});
