import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { identifierResultsXStoreModule } from '../module';
import {
  IdentifierResultsActions,
  IdentifierResultsGetters,
  IdentifierResultsMutations,
  IdentifierResultsState
} from '../types';
import { resetIdentifierResultsStateWith } from './utils';

describe('testing identifier results module actions', () => {
  const mockedResults = getResultsStub();
  const adapter = getMockedAdapter({
    identifierResults: { results: mockedResults }
  });

  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: SafeStore<
    IdentifierResultsState,
    IdentifierResultsGetters,
    IdentifierResultsMutations,
    IdentifierResultsActions
  > = new Store(identifierResultsXStoreModule as any);
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetIdentifierResultsStateWith(store);
    jest.clearAllMocks();
  });

  describe('fetchIdentifierResults', () => {
    it('should return identifier results', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });

      const identifierResults = await store.dispatch(
        'fetchIdentifierResults',
        store.getters.identifierResultsRequest
      );
      expect(identifierResults).toEqual(mockedResults);
    });

    it('should return empty array if there is not request', async () => {
      const identifierResults = await store.dispatch(
        'fetchIdentifierResults',
        store.getters.identifierResultsRequest
      );
      expect(identifierResults).toEqual([]);
    });
  });

  describe('fetchAndSaveIdentifierResults', () => {
    it('should include the origin in the request', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc', origin: 'search_box:external' });
      await store.dispatch('fetchAndSaveIdentifierResults', store.getters.identifierResultsRequest);

      expect(adapter.identifierResults).toHaveBeenCalledTimes(1);
      expect(adapter.identifierResults).toHaveBeenCalledWith({
        ...store.getters.identifierResultsRequest,
        origin: 'search_box:external'
      });
    });

    it('should request and store identifier results in the state', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });

      const actionPromise = store.dispatch(
        'fetchAndSaveIdentifierResults',
        store.getters.identifierResultsRequest
      );
      expect(store.state.status).toEqual('loading');
      await actionPromise;

      expect(store.state.identifierResults).toEqual(mockedResults);
      expect(store.state.status).toEqual('success');
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });
      const initialIdentifierResults = store.state.identifierResults;
      adapter.identifierResults.mockResolvedValueOnce({ results: mockedResults.slice(0, 1) });

      const firstRequest = store.dispatch(
        'fetchAndSaveIdentifierResults',
        store.getters.identifierResultsRequest
      );
      const secondRequest = store.dispatch(
        'fetchAndSaveIdentifierResults',
        store.getters.identifierResultsRequest
      );

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.identifierResults).toBe(initialIdentifierResults);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.identifierResults).toEqual(mockedResults);
    });

    it('should set the status to error when it fails', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });
      adapter.identifierResults.mockRejectedValueOnce('Generic error');
      const identifierResults = store.state.identifierResults;
      await store.dispatch('fetchAndSaveIdentifierResults', store.getters.identifierResultsRequest);

      expect(store.state.identifierResults).toBe(identifierResults);
      expect(store.state.status).toEqual('error');
    });
  });

  describe('cancelFetchAndSaveIdentifierResults', () => {
    it('should cancel the request and do not modify the stored identifier results', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });
      const previousIdentifierResults = store.state.identifierResults;
      await Promise.all([
        store.dispatch('fetchAndSaveIdentifierResults', store.getters.identifierResultsRequest),
        store.dispatch('cancelFetchAndSaveIdentifierResults')
      ]);
      expect(store.state.identifierResults).toEqual(previousIdentifierResults);
      expect(store.state.status).toEqual('success');
    });
  });

  describe('saveQuery', () => {
    const identifierDetectionRegexp = '^[0-9]{2,}$';
    it('should store the query in the state if it matches the regex', async () => {
      resetIdentifierResultsStateWith(store, { config: { identifierDetectionRegexp } });

      await store.dispatch('saveQuery', '1906');
      expect(store.state.query).toEqual('1906');
    });
    it(`should not store query in the state if it doesn't match the regex`, async () => {
      resetIdentifierResultsStateWith(store, { config: { identifierDetectionRegexp } });

      await store.dispatch('saveQuery', '1 thousand nine hundred and 6');
      expect(store.state.query).toEqual('');
    });

    // eslint-disable-next-line max-len
    it(`should removes the query and identifier results if the new query doesn't match the regex`, async () => {
      resetIdentifierResultsStateWith(store, { config: { identifierDetectionRegexp } });

      await store.dispatch('saveQuery', '1906');
      await store.dispatch('fetchAndSaveIdentifierResults', store.getters.identifierResultsRequest);

      expect(store.state.query).toEqual('1906');
      expect(store.state.identifierResults).toHaveLength(mockedResults.length);

      await store.dispatch('saveQuery', '1 thousand nine hundred and 6');
      expect(store.state.query).toEqual('');
      expect(store.state.identifierResults).toHaveLength(0);
    });
  });

  describe('saveOrigin', () => {
    it('saves valid origins', async () => {
      resetIdentifierResultsStateWith(store);

      await store.dispatch('saveOrigin', { feature: 'search_box', location: 'predictive_layer' });
      expect(store.state.origin).toEqual('search_box:predictive_layer');

      await store.dispatch('saveOrigin', { feature: 'search_box' });
      expect(store.state.origin).toEqual('search_box:none');
    });

    it('saves `null` if it is impossible to create an origin', async () => {
      resetIdentifierResultsStateWith(store, { query: 'funko' });

      await store.dispatch('saveOrigin', { location: 'predictive_layer' });
      expect(store.state.origin).toBeNull();

      await store.dispatch('saveOrigin', {});
      expect(store.state.origin).toBeNull();
    });
  });
});
