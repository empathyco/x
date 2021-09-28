import { SearchResponse } from '@empathyco/x-adapter';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getBannersStub } from '../../../../__stubs__/banners-stubs.factory';
import { getFacetsStub } from '../../../../__stubs__/facets-stubs.factory';
import { getPromotedsStub } from '../../../../__stubs__/promoteds-stubs.factory';
import { getRedirectionsStub } from '../../../../__stubs__/redirections-stubs.factory';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getSearchResponseStub } from '../../../../__stubs__/search-response-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { searchXStoreModule } from '../module';
import { SearchActions, SearchGetters, SearchMutations, SearchState } from '../types';
import { resetSearchStateWith } from './utils';

describe('testing search module actions', () => {
  const resultsStub = getResultsStub();
  const facetsStub = getFacetsStub();
  const bannersStub = getBannersStub();
  const promotedsStub = getPromotedsStub();
  const redirectionsStub = getRedirectionsStub();
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

  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: SafeStore<SearchState, SearchGetters, SearchMutations, SearchActions> = new Store(
    searchXStoreModule as any
  );
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetSearchStateWith(store);
  });

  describe(`fetchSearchResponse`, () => {
    it('should return search response', async () => {
      resetSearchStateWith(store, {
        query: 'lego'
      });

      const searchResponse = await store.dispatch('fetchSearchResponse', store.getters.request);
      expect(searchResponse).toEqual(searchResponseStub);
    });

    it('should return empty search response if there is not request', async () => {
      const searchResponse = await store.dispatch('fetchSearchResponse', store.getters.request);
      expect(searchResponse).toEqual(mockedEmptySearchResponse);
    });
  });

  describe(`fetchAndSaveSearchResponse`, () => {
    // eslint-disable-next-line max-len
    it('should request and store results, facets, banners, promoteds and redirections in the state', async () => {
      resetSearchStateWith(store, {
        query: 'lego'
      });

      const actionPromise = store.dispatch('fetchAndSaveSearchResponse', store.getters.request);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.results).toEqual(resultsStub);
      expect(store.state.facets).toEqual(facetsStub);
      expect(store.state.banners).toEqual(bannersStub);
      expect(store.state.promoteds).toEqual(promotedsStub);
      expect(store.state.redirections).toEqual(redirectionsStub);
      expect(store.state.page).toEqual(1);
      expect(store.state.config.pageSize).toEqual(24);
      expect(store.state.status).toEqual('success');
    });

    // eslint-disable-next-line max-len
    it('should clear results, facets, banners and promoteds in the state if the query is empty', async () => {
      resetSearchStateWith(store, {
        results: resultsStub,
        facets: facetsStub,
        banners: bannersStub,
        promoteds: promotedsStub
      });
      expect(store.state.results).toEqual(resultsStub);
      expect(store.state.facets).toEqual(facetsStub);
      expect(store.state.banners).toEqual(bannersStub);
      expect(store.state.promoteds).toEqual(promotedsStub);
      await store.dispatch('fetchAndSaveSearchResponse', store.getters.request);
      expect(store.state.results).toEqual([]);
      expect(store.state.facets).toEqual([]);
      expect(store.state.banners).toEqual([]);
      expect(store.state.promoteds).toEqual([]);
    });

    it('should request and store total results in the state', async () => {
      resetSearchStateWith(store, {
        query: 'lego'
      });

      adapter.search.mockResolvedValueOnce({
        ...mockedEmptySearchResponse,
        totalResults: 116
      });

      const actionPromise = store.dispatch('fetchAndSaveSearchResponse', store.getters.request);
      await actionPromise;
      expect(store.state.totalResults).toBe(116);
    });

    it('should clear the total results in the state', async () => {
      resetSearchStateWith(store, {
        query: ''
      });
      const actionPromise = store.dispatch('fetchAndSaveSearchResponse', store.getters.request);
      await actionPromise;
      expect(store.state.totalResults).toBe(0);
    });

    it('should request and store spellcheck in the state', async () => {
      resetSearchStateWith(store, {
        query: 'coce'
      });

      adapter.search.mockResolvedValueOnce({
        ...mockedEmptySearchResponse,
        spellcheck: 'coche'
      });

      const actionPromise = store.dispatch('fetchAndSaveSearchResponse', store.getters.request);
      await actionPromise;
      expect(store.state.spellcheckedQuery).toBe('coche');
    });

    it('should clear the spellcheck in the state', async () => {
      resetSearchStateWith(store, {
        spellcheckedQuery: 'coche'
      });
      const actionPromise = store.dispatch('fetchAndSaveSearchResponse', store.getters.request);
      await actionPromise;
      expect(store.state.spellcheckedQuery).toBe('');
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetSearchStateWith(store, { query: 'beer' });
      const {
        results: initialResults,
        facets: initialFacets,
        banners: initialBanners,
        promoteds: initialPromoteds,
        redirections: initialRedirections
      } = store.state;
      adapter.search.mockResolvedValueOnce({
        ...mockedEmptySearchResponse,
        results: resultsStub.slice(0, 1),
        facets: facetsStub.slice(0, 1)
      });

      const firstRequest = store.dispatch('fetchAndSaveSearchResponse', store.getters.request);
      const secondRequest = store.dispatch('fetchAndSaveSearchResponse', store.getters.request);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.results).toBe(initialResults);
      expect(store.state.facets).toBe(initialFacets);
      expect(store.state.banners).toEqual(initialBanners);
      expect(store.state.promoteds).toEqual(initialPromoteds);
      expect(store.state.promoteds).toEqual(initialPromoteds);
      expect(store.state.redirections).toEqual(initialRedirections);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.results).toEqual(resultsStub);
      expect(store.state.facets).toEqual(facetsStub);
      expect(store.state.banners).toEqual(bannersStub);
      expect(store.state.promoteds).toEqual(promotedsStub);
      expect(store.state.redirections).toEqual(redirectionsStub);
    });

    it('should set the status to error when it fails', async () => {
      resetSearchStateWith(store, { query: 'lego' });
      adapter.search.mockRejectedValueOnce('Generic error');
      const { results, facets, banners, promoteds } = store.state;
      await store.dispatch('fetchAndSaveSearchResponse', store.getters.request);

      expect(store.state.results).toBe(results);
      expect(store.state.facets).toBe(facets);
      expect(store.state.banners).toBe(banners);
      expect(store.state.promoteds).toBe(promoteds);
      expect(store.state.status).toEqual('error');
    });
  });

  describe(`cancelFetchAndSaveSearchResponse`, () => {
    it('should cancel the request and do not modify the stored results', async () => {
      resetSearchStateWith(store, { query: 'lego' });
      const {
        results: previousResults,
        facets: previousFacets,
        banners: previousBanners,
        promoteds: previousPromoteds
      } = store.state;
      await Promise.all([
        store.dispatch('fetchAndSaveSearchResponse', store.getters.request),
        store.dispatch('cancelFetchAndSaveSearchResponse')
      ]);
      expect(store.state.results).toEqual(previousResults);
      expect(store.state.facets).toEqual(previousFacets);
      expect(store.state.banners).toEqual(previousBanners);
      expect(store.state.promoteds).toEqual(previousPromoteds);
      expect(store.state.status).toEqual('success');
    });
  });

  describe(`increasePageAppendingResults`, () => {
    it('should increases by one the current page of the search module', async () => {
      resetSearchStateWith(store, { totalResults: 100 });

      await store.dispatch('increasePageAppendingResults');

      expect(store.state.page).toEqual(2);
    });

    // eslint-disable-next-line max-len
    it('should not increases the current page of the search module if there not more results', async () => {
      resetSearchStateWith(store, { totalResults: 48, page: 1, config: { pageSize: 24 } });

      await store.dispatch('increasePageAppendingResults');
      expect(store.state.page).toEqual(2);

      await store.dispatch('increasePageAppendingResults');
      expect(store.state.page).toEqual(2);
    });

    // eslint-disable-next-line max-len
    it('appends results to the state when the page increases and the isAppendResults is true', async () => {
      resetSearchStateWith(store, {
        query: 'lego',
        results: resultsStub.slice(0, 1),
        banners: bannersStub.slice(0, 1),
        promoteds: promotedsStub.slice(0, 1),
        isAppendResults: true
      });

      adapter.search.mockResolvedValueOnce({
        ...mockedEmptySearchResponse,
        results: resultsStub.slice(1, 2),
        banners: bannersStub.slice(0, 1),
        promoteds: promotedsStub.slice(1, 2)
      });

      await store.dispatch('fetchAndSaveSearchResponse', store.getters.request);

      expect(store.state.results).toEqual(resultsStub.slice(0, 2));
      expect(store.state.banners).toEqual(bannersStub.slice(0, 1));
      expect(store.state.promoteds).toEqual(promotedsStub.slice(0, 1));
    });

    // eslint-disable-next-line max-len
    it('overrides results, banners and promoteds to the state when the page increases and the isAppendResults is false', async () => {
      resetSearchStateWith(store, {
        query: 'lego',
        results: resultsStub.slice(0, 1),
        banners: bannersStub.slice(0, 1),
        promoteds: promotedsStub.slice(0, 1),
        isAppendResults: false
      });

      adapter.search.mockResolvedValueOnce({
        ...mockedEmptySearchResponse,
        results: resultsStub.slice(1, 2),
        banners: bannersStub.slice(1, 2),
        promoteds: promotedsStub.slice(1, 2)
      });

      await store.dispatch('fetchAndSaveSearchResponse', store.getters.request);

      expect(store.state.results).toEqual(resultsStub.slice(1, 2));
      expect(store.state.banners).toEqual(bannersStub.slice(1, 2));
      expect(store.state.promoteds).toEqual(promotedsStub.slice(1, 2));
    });
  });

  describe(`setParamsFromUrl`, () => {
    it('should set the params of the search module', async () => {
      resetSearchStateWith(store, { query: 'funko', page: 1 });

      await store.dispatch('setParamsFromUrl', { query: 'lego', page: 2 });

      expect(store.state.query).toEqual('lego');
      expect(store.state.page).toEqual(2);
    });

    it('should not set the query of the search module', async () => {
      resetSearchStateWith(store, { query: 'funko' });

      await store.dispatch('setParamsFromUrl', { page: 2 });

      expect(store.state.query).toEqual('funko');
      expect(store.state.page).toEqual(2);
    });

    it('should not set the page of the search module', async () => {
      resetSearchStateWith(store, { page: 1 });

      await store.dispatch('setParamsFromUrl', { query: 'funko' });

      expect(store.state.page).toEqual(1);
    });
  });
});
