import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getBannersStub } from '../../../../__stubs__/banners-stubs.factory';
//eslint-disable-next-line max-len
import { getEmptySearchResponseStub } from '../../../../__stubs__/empty-search-response-stubs.factory';
import { getFacetsStub } from '../../../../__stubs__/facets-stubs.factory';
import { getPartialResultsStub } from '../../../../__stubs__/partials-results-stubs.factory';
import { getPromotedsStub } from '../../../../__stubs__/promoteds-stubs.factory';
import { getRedirectionsStub } from '../../../../__stubs__/redirections-stubs.factory';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getSearchResponseStub } from '../../../../__stubs__/search-response-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { UrlParams } from '../../../../types/url-params';
import { searchXStoreModule } from '../module';
import { SearchActions, SearchGetters, SearchMutations, SearchState } from '../types';
import { resetSearchStateWith } from './utils';

describe('testing search module actions', () => {
  const resultsStub = getResultsStub();
  const facetsStub = getFacetsStub();
  const bannersStub = getBannersStub();
  const partialResultsStub = getPartialResultsStub();
  const promotedsStub = getPromotedsStub();
  const redirectionsStub = getRedirectionsStub();
  const searchResponseStub = getSearchResponseStub();
  const emptySearchResponseStub = getEmptySearchResponseStub();

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
    jest.clearAllMocks();
  });

  describe('fetchSearchResponse', () => {
    it('should return search response', async () => {
      resetSearchStateWith(store, {
        query: 'lego'
      });

      const searchResponse = await store.dispatch('fetchSearchResponse', store.getters.request);
      expect(searchResponse).toEqual(searchResponseStub);
    });

    it('should return empty search response if there is not request', async () => {
      const searchResponse = await store.dispatch('fetchSearchResponse', store.getters.request);
      expect(searchResponse).toEqual(emptySearchResponseStub);
    });
  });

  describe('fetchAndSaveSearchResponse', () => {
    it('should include the origin, start and rows properties in the request', async () => {
      resetSearchStateWith(store, { query: 'lego', origin: 'search_box:external' });
      const { page, ...restRequest } = store.getters.request!;
      await store.dispatch('fetchAndSaveSearchResponse', store.getters.request);

      expect(adapter.search).toHaveBeenCalledTimes(1);
      expect(adapter.search).toHaveBeenCalledWith({
        ...restRequest,
        origin: 'search_box:external',
        start: 0,
        rows: 24
      });
    });

    it('should calculate correctly the start and rows properties', async () => {
      resetSearchStateWith(store, {
        config: { pageSize: 48 },
        page: 2,
        query: 'lego',
        results: getResultsStub(48)
      });
      const { page, ...restRequest } = store.getters.request!;
      await store.dispatch('fetchAndSaveSearchResponse', store.getters.request);

      expect(adapter.search).toHaveBeenCalledTimes(1);
      expect(adapter.search).toHaveBeenCalledWith({
        ...restRequest,
        start: 48,
        rows: 48
      });
    });

    // eslint-disable-next-line max-len
    it('should request and store results, facets, banners, promoteds, redirections and query tagging in the state', async () => {
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
      expect(store.state.queryTagging).toEqual(searchResponseStub.queryTagging);
    });

    it('should set undefined response values to their default values', async () => {
      resetSearchStateWith(store, {
        query: 'lego'
      });
      adapter.search.mockResolvedValueOnce({
        ...searchResponseStub,
        banners: undefined,
        partialResults: undefined,
        promoteds: undefined,
        redirections: undefined,
        spellcheck: undefined
      });

      await store.dispatch('fetchAndSaveSearchResponse', store.getters.request);
      expect(store.state.results).toEqual(resultsStub);
      expect(store.state.facets).toEqual(facetsStub);
      expect(store.state.banners).toEqual([]);
      expect(store.state.partialResults).toEqual([]);
      expect(store.state.promoteds).toEqual([]);
      expect(store.state.spellcheckedQuery).toEqual('');
      expect(store.state.redirections).toEqual([]);
      expect(store.state.page).toEqual(1);
      expect(store.state.config.pageSize).toEqual(24);
      expect(store.state.status).toEqual('success');
      expect(store.state.queryTagging).toEqual(searchResponseStub.queryTagging);
    });

    // eslint-disable-next-line max-len
    it('should clear results, facets, banners, promoteds, redirections and query tagging in the state if the query is empty', async () => {
      resetSearchStateWith(store, {
        results: resultsStub,
        facets: facetsStub,
        banners: bannersStub,
        promoteds: promotedsStub,
        redirections: redirectionsStub,
        queryTagging: searchResponseStub.queryTagging
      });
      expect(store.state.results).toEqual(resultsStub);
      expect(store.state.facets).toEqual(facetsStub);
      expect(store.state.banners).toEqual(bannersStub);
      expect(store.state.promoteds).toEqual(promotedsStub);
      expect(store.state.redirections).toEqual(redirectionsStub);
      expect(store.state.queryTagging).toEqual(searchResponseStub.queryTagging);
      await store.dispatch('fetchAndSaveSearchResponse', store.getters.request);
      expect(store.state.results).toEqual([]);
      expect(store.state.facets).toEqual([]);
      expect(store.state.banners).toEqual([]);
      expect(store.state.promoteds).toEqual([]);
      expect(store.state.redirections).toEqual([]);
      expect(store.state.queryTagging).toEqual({ url: '', params: {} });
    });

    it('should request and store total results in the state', async () => {
      resetSearchStateWith(store, {
        query: 'lego'
      });

      adapter.search.mockResolvedValueOnce({
        ...emptySearchResponseStub,
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
        ...emptySearchResponseStub,
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
      await store.dispatch('fetchAndSaveSearchResponse', store.getters.request);
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
        ...emptySearchResponseStub,
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

  describe('saveSearchResponse', () => {
    it('saves the search response in the search state', () => {
      store.dispatch('saveSearchResponse', {
        ...searchResponseStub,
        partialResults: [...partialResultsStub]
      });
      expect(store.state.results).toEqual(resultsStub);
      expect(store.state.facets).toEqual(facetsStub);
      expect(store.state.banners).toEqual(bannersStub);
      expect(store.state.partialResults).toEqual(partialResultsStub);
      expect(store.state.promoteds).toEqual(promotedsStub);
      expect(store.state.redirections).toEqual(redirectionsStub);
      expect(store.state.spellcheckedQuery).toEqual('');
      expect(store.state.page).toEqual(1);
      expect(store.state.config.pageSize).toEqual(24);
      expect(store.state.queryTagging).toEqual(searchResponseStub.queryTagging);
    });

    // eslint-disable-next-line max-len
    it('saves default values of optional or undefined response properties in the search state', () => {
      store.dispatch('saveSearchResponse', {
        ...searchResponseStub,
        partialResults: undefined,
        redirections: undefined,
        banners: undefined,
        promoteds: undefined,
        spellcheck: undefined
      });
      expect(store.state.results).toEqual(resultsStub);
      expect(store.state.facets).toEqual(facetsStub);
      expect(store.state.banners).toEqual([]);
      expect(store.state.partialResults).toEqual([]);
      expect(store.state.promoteds).toEqual([]);
      expect(store.state.redirections).toEqual([]);
      expect(store.state.spellcheckedQuery).toEqual('');
      expect(store.state.page).toEqual(1);
      expect(store.state.config.pageSize).toEqual(24);
      expect(store.state.queryTagging).toEqual(searchResponseStub.queryTagging);
    });
  });

  describe('cancelFetchAndSaveSearchResponse', () => {
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

  describe('increasePageAppendingResults', () => {
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

    it('should increase page if the last page has less results than the page size', async () => {
      resetSearchStateWith(store, { totalResults: 47, page: 1, config: { pageSize: 24 } });

      await store.dispatch('increasePageAppendingResults');
      expect(store.state.page).toEqual(2);
    });

    it('should increase page if the last page has only one result', async () => {
      resetSearchStateWith(store, { totalResults: 25, page: 1, config: { pageSize: 24 } });

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
        ...emptySearchResponseStub,
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
        ...emptySearchResponseStub,
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

  describe('resetState', () => {
    // Note that the following tests are meant for the resetState action, which
    // does not modify all fields but only some of them.
    it('should not reset the page when the page parameter of the request changes', async () => {
      resetSearchStateWith(store, { query: 'lego', page: 2 });
      await store.dispatch('resetState', {
        newRequest: {
          query: 'lego',
          page: 3
        },
        oldRequest: store.getters.request!
      });

      expect(store.state).toEqual(
        expect.objectContaining<Partial<SearchState>>({
          page: 2,
          params: {},
          query: 'lego',
          relatedTags: [],
          selectedFilters: {},
          sort: ''
        })
      );
    });

    it('should not reset the page nor the sort when there are no changes', async () => {
      resetSearchStateWith(store, { query: 'lego', page: 2, sort: 'desc' });
      await store.dispatch('resetState', {
        newRequest: {
          query: 'lego',
          page: 2,
          sort: 'desc'
        },
        oldRequest: store.getters.request!
      });

      expect(store.state).toEqual(
        expect.objectContaining<Partial<SearchState>>({
          page: 2,
          params: {},
          query: 'lego',
          relatedTags: [],
          selectedFilters: {},
          sort: 'desc'
        })
      );
    });

    it('should reset the page when the query changes', async () => {
      resetSearchStateWith(store, { query: 'lego', page: 2 });
      await store.dispatch('resetState', {
        newRequest: {
          query: 'playmobil',
          page: 2
        },
        oldRequest: store.getters.request!
      });

      expect(store.state).toEqual(
        expect.objectContaining<Partial<SearchState>>({
          page: 1,
          params: {},
          query: 'lego',
          relatedTags: [],
          selectedFilters: {},
          sort: ''
        })
      );
    });

    it('should reset the page when the sort changes', async () => {
      resetSearchStateWith(store, { query: 'lego', page: 2 });
      await store.dispatch('resetState', {
        newRequest: {
          query: 'lego',
          page: 2,
          sort: 'desc'
        },
        oldRequest: store.getters.request!
      });

      expect(store.state).toEqual(
        expect.objectContaining<Partial<SearchState>>({
          page: 1,
          params: {},
          query: 'lego',
          relatedTags: [],
          selectedFilters: {},
          sort: ''
        })
      );
    });

    it('should reset the page when the related tags change', async () => {
      resetSearchStateWith(store, { query: 'lego', page: 2 });
      const oldRequest = store.getters.request!;
      store.commit('setRelatedTags', [
        { query: 'lego star wars', modelName: 'RelatedTag', tag: 'star wars' }
      ]);
      const newRequest = store.getters.request!;
      await store.dispatch('resetState', { oldRequest, newRequest });

      expect(store.state).toEqual(
        expect.objectContaining<Partial<SearchState>>({
          page: 1,
          params: {},
          query: 'lego',
          selectedFilters: {},
          sort: ''
        })
      );
    });

    it('should reset the page when the filters change', async () => {
      resetSearchStateWith(store, { query: 'lego', page: 2 });
      await store.dispatch('resetState', {
        newRequest: {
          query: 'lego',
          page: 2,
          filters: {
            age_facet: [
              {
                id: '{!tag=age_facet}age_facet:"toddler"',
                modelName: 'SimpleFilter',
                selected: true
              }
            ]
          }
        },
        oldRequest: store.getters.request!
      });

      expect(store.state).toEqual(
        expect.objectContaining<Partial<SearchState>>({
          page: 1,
          params: {},
          query: 'lego',
          relatedTags: [],
          selectedFilters: {},
          sort: ''
        })
      );
    });

    it('should reset the sort when the query parameter of the request changes', async () => {
      resetSearchStateWith(store, { query: 'lego', page: 1, sort: 'price asc' });
      await store.dispatch('resetState', {
        newRequest: {
          query: 'playmobil',
          page: 1
        },
        oldRequest: store.getters.request!
      });

      expect(store.state).toEqual(
        expect.objectContaining<Partial<SearchState>>({
          page: 1,
          params: {},
          query: 'lego',
          relatedTags: [],
          selectedFilters: {},
          sort: ''
        })
      );
    });

    it('should reset the page and sort when any extra param of the request changes', async () => {
      resetSearchStateWith(store, {
        query: 'lego',
        page: 2,
        sort: 'price asc',
        params: {
          catalog: 'es'
        }
      });
      await store.dispatch('resetState', {
        newRequest: {
          query: 'lego',
          page: 2,
          extraParams: {
            catalog: 'pt'
          }
        },
        oldRequest: store.getters.request!
      });

      expect(store.state).toEqual(
        expect.objectContaining<Partial<SearchState>>({
          page: 1,
          params: {
            catalog: 'es'
          },
          query: 'lego',
          relatedTags: [],
          selectedFilters: {},
          sort: ''
        })
      );
    });
  });

  describe('setUrlParams', () => {
    it('should set the params of the search module', async () => {
      resetSearchStateWith(store, { query: 'funko', page: 1, sort: '' });

      await store.dispatch('setUrlParams', {
        query: 'lego',
        page: 2,
        sort: 'priceSort asc'
      } as UrlParams);

      expect(store.state.query).toEqual('lego');
      expect(store.state.page).toEqual(2);
      expect(store.state.sort).toEqual('priceSort asc');
    });

    it('should set in the search module the query value even if empty', async () => {
      resetSearchStateWith(store, { query: 'funko' });

      await store.dispatch('setUrlParams', { page: 2, query: '' } as UrlParams);

      expect(store.state.query).toEqual('');
      expect(store.state.page).toEqual(2);
    });

    it('should set in the search module the sort value even if empty', async () => {
      resetSearchStateWith(store, { sort: 'priceSort asc' });

      await store.dispatch('setUrlParams', { page: 2, sort: '' } as UrlParams);

      expect(store.state.sort).toEqual('');
      expect(store.state.page).toEqual(2);
    });
  });

  describe('saveOrigin', () => {
    it('saves valid origins', async () => {
      resetSearchStateWith(store);

      await store.dispatch('saveOrigin', { feature: 'search_box', location: 'predictive_layer' });
      expect(store.state.origin).toEqual('search_box:predictive_layer');

      await store.dispatch('saveOrigin', { feature: 'search_box' });
      expect(store.state.origin).toEqual('search_box:none');
    });

    it('saves `null` if it is impossible to create an origin', async () => {
      resetSearchStateWith(store, { query: 'funko' });

      await store.dispatch('saveOrigin', { location: 'predictive_layer' });
      expect(store.state.origin).toBeNull();

      await store.dispatch('saveOrigin', {});
      expect(store.state.origin).toBeNull();
    });
  });
});
