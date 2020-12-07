import { SearchResponse } from '@empathy/search-adapter';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { getFacetsStub } from '../../../../__stubs__/facets-stubs.factory';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getSearchResponseStub } from '../../../../__stubs__/search-response-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { searchXStoreModule } from '../module';
import { SearchState } from '../types';
import { resetSearchStateWith } from './utils';

describe('testing search module actions', () => {
  const resultsStub = getResultsStub();
  const facetsStub = getFacetsStub();
  const searchResponseStub = getSearchResponseStub();

  const mockedEmptySearchResponse: SearchResponse = {
    banners: [],
    facets: [],
    partialResults: [],
    promoteds: [],
    queryTagging: {
      params: {},
      url: ''
    },
    redirections: [],
    results: [],
    spellcheck: '',
    totalResults: 0
  };

  const adapter = getMockedAdapter({ search: searchResponseStub });

  const actionKeys = map(searchXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: Store<SearchState> = new Store(searchXStoreModule as any);
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetSearchStateWith(store);
  });

  describe(`${actionKeys.fetchSearchResponse}`, () => {
    it('should return search response', async () => {
      resetSearchStateWith(store, {
        query: 'lego'
      });

      const searchResponse = await store.dispatch(actionKeys.fetchSearchResponse);
      expect(searchResponse).toEqual(searchResponseStub);
    });

    it('should return empty search response if there is not request', async () => {
      const searchResponse = await store.dispatch(actionKeys.fetchSearchResponse);
      expect(searchResponse).toEqual(mockedEmptySearchResponse);
    });
  });

  describe(`${actionKeys.fetchAndSaveSearchResponse}`, () => {
    it('should request and store results and facets in the state', async () => {
      resetSearchStateWith(store, {
        query: 'lego'
      });

      const actionPromise = store.dispatch(actionKeys.fetchAndSaveSearchResponse);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.results).toEqual(resultsStub);
      expect(store.state.facets).toEqual(facetsStub);
      expect(store.state.status).toEqual('success');
    });

    it('should clear results and facets in the state if the query is empty', async () => {
      resetSearchStateWith(store, { results: resultsStub, facets: facetsStub });
      expect(store.state.results).toEqual(resultsStub);
      expect(store.state.facets).toEqual(facetsStub);
      await store.dispatch(actionKeys.fetchAndSaveSearchResponse);
      expect(store.state.results).toEqual([]);
      expect(store.state.facets).toEqual([]);
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetSearchStateWith(store, { query: 'beer' });
      const { results: initialResults, facets: initialFacets } = store.state;
      adapter.search.mockResolvedValueOnce({
        ...mockedEmptySearchResponse,
        results: resultsStub.slice(0, 1),
        facets: facetsStub.slice(0, 1)
      });

      const firstRequest = store.dispatch(actionKeys.fetchAndSaveSearchResponse);
      const secondRequest = store.dispatch(actionKeys.fetchAndSaveSearchResponse);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.results).toBe(initialResults);
      expect(store.state.facets).toBe(initialFacets);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.results).toEqual(resultsStub);
      expect(store.state.facets).toEqual(facetsStub);
    });

    it('should set the status to error when it fails', async () => {
      resetSearchStateWith(store, { query: 'lego' });
      adapter.search.mockRejectedValueOnce('Generic error');
      const { results, facets } = store.state;
      await store.dispatch(actionKeys.fetchAndSaveSearchResponse);

      expect(store.state.results).toBe(results);
      expect(store.state.facets).toBe(facets);
      expect(store.state.status).toEqual('error');
    });
  });

  describe(`${actionKeys.cancelFetchAndSaveSearchResponse}`, () => {
    it('should cancel the request and do not modify the stored results', async () => {
      resetSearchStateWith(store, { query: 'lego' });
      const { results: previousResults, facets: previousFacets } = store.state;
      await Promise.all([
        store.dispatch(actionKeys.fetchAndSaveSearchResponse),
        store.dispatch(actionKeys.cancelFetchAndSaveSearchResponse)
      ]);
      expect(store.state.results).toEqual(previousResults);
      expect(store.state.facets).toEqual(previousFacets);
      expect(store.state.status).toEqual('success');
    });
  });
});
