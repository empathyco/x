import Vue, { defineComponent } from 'vue';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { AnyXStoreModule } from '../../store/index';
import { UseAliasAPI, useAliasApi, UseAliasQueryAPI, UseAliasStatusAPI } from '../use-alias-api';
import { searchBoxXStoreModule } from '../../x-modules/search-box/index';
import { nextQueriesXStoreModule } from '../../x-modules/next-queries/index';
import { querySuggestionsXStoreModule } from '../../x-modules/query-suggestions/index';
import { relatedTagsXStoreModule } from '../../x-modules/related-tags/index';
import { searchXStoreModule } from '../../x-modules/search/index';
import { facetsXStoreModule } from '../../x-modules/facets/index';
import { identifierResultsXStoreModule } from '../../x-modules/identifier-results/index';
import { popularSearchesXStoreModule } from '../../x-modules/popular-searches/index';
import { recommendationsXStoreModule } from '../../x-modules/recommendations/index';
import { historyQueriesXStoreModule } from '../../x-modules/history-queries/index';

const renderUseAliasApiTest = (): renderUseAliasApiTestAPI => {
  const testComponent = defineComponent({
    setup() {
      const xAliasAPI = useAliasApi();
      const query = xAliasAPI.query;
      const status = xAliasAPI.status;
      return {
        query,
        status,
        xAliasAPI
      };
    }
  });

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store({
    modules: {
      x: {
        namespaced: true,
        modules: {
          searchBox: { namespaced: true, ...searchBoxXStoreModule } as AnyXStoreModule,
          nextQueries: { namespaced: true, ...nextQueriesXStoreModule } as AnyXStoreModule,
          querySuggestions: {
            namespaced: true,
            ...querySuggestionsXStoreModule
          } as AnyXStoreModule,
          relatedTags: { namespaced: true, ...relatedTagsXStoreModule } as AnyXStoreModule,
          search: { namespaced: true, ...searchXStoreModule } as AnyXStoreModule,
          facets: { namespaced: true, ...facetsXStoreModule } as AnyXStoreModule,
          historyQueries: { namespaced: true, ...historyQueriesXStoreModule } as AnyXStoreModule,
          identifierResults: {
            namespaced: true,
            ...identifierResultsXStoreModule
          } as AnyXStoreModule,
          popularSearches: { namespaced: true, ...popularSearchesXStoreModule } as AnyXStoreModule,
          recommendations: { namespaced: true, ...recommendationsXStoreModule } as AnyXStoreModule
        }
      }
    }
  });

  const wrapper = mount(testComponent, {
    localVue,
    store
  });

  return {
    store,
    wrapper,
    query: (wrapper.vm as any).query,
    status: (wrapper.vm as any).status,
    xAliasAPI: (wrapper.vm as any).xAliasAPI
  };
};
describe('testing useAliasApi composable', () => {
  it('updates the query values when the module is registered', () => {
    const { store, query } = renderUseAliasApiTest();

    expect(query).toEqual({
      searchBox: '',
      nextQueries: '',
      querySuggestions: '',
      relatedTags: '',
      search: '',
      facets: ''
    });

    store.commit('x/searchBox/setQuery', 'salchichón');
    store.commit('x/nextQueries/setQuery', 'chorizo');
    store.commit('x/querySuggestions/setQuery', 'lomo');
    store.commit('x/relatedTags/setQuery', 'jamón');
    store.commit('x/search/setQuery', 'cecina');
    store.commit('x/facets/setQuery', 'mortadela');
    store.commit('x/historyQueries/setQuery', 'queso');

    expect(query).toEqual({
      searchBox: 'salchichón',
      nextQueries: 'chorizo',
      querySuggestions: 'lomo',
      relatedTags: 'jamón',
      search: 'cecina',
      facets: 'mortadela'
    });
  });
  it('updates the status values when the module is registered', () => {
    const REQUEST_STATUS_REGEX = /success|loading|error|initial/;
    const { status } = renderUseAliasApiTest();

    expect(status).toEqual({
      identifierResults: expect.stringMatching(REQUEST_STATUS_REGEX),
      popularSearches: expect.stringMatching(REQUEST_STATUS_REGEX),
      recommendations: expect.stringMatching(REQUEST_STATUS_REGEX),
      nextQueries: expect.stringMatching(REQUEST_STATUS_REGEX),
      querySuggestions: expect.stringMatching(REQUEST_STATUS_REGEX),
      relatedTags: expect.stringMatching(REQUEST_STATUS_REGEX),
      search: expect.stringMatching(REQUEST_STATUS_REGEX)
    });
  });
  it('updates a property', () => {
    const { store, xAliasAPI } = renderUseAliasApiTest();
    expect(xAliasAPI.historyQueries.value[0]).toBeUndefined();

    store.dispatch('x/historyQueries/addQueryToHistory', 'chorizo');

    expect(xAliasAPI.historyQueries.value[0].query).toEqual('chorizo');
  });
});

type renderUseAliasApiTestAPI = {
  store: Store<any>;
  wrapper: Wrapper<Vue>;
  query: UseAliasQueryAPI;
  status: UseAliasStatusAPI;
  xAliasAPI: UseAliasAPI;
};
