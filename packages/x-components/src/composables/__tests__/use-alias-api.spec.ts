import { defineComponent } from 'vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { Store } from 'vuex';
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
import { installNewXPlugin } from '../../__tests__/utils';

const renderUseAliasApiTest = (registerXModules = true): renderUseAliasApiTestAPI => {
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
    },
    template: '<div></div>'
  });

  const store = new Store({
    modules: {
      x: {
        namespaced: true,
        modules: registerXModules
          ? {
              searchBox: { namespaced: true, ...searchBoxXStoreModule } as AnyXStoreModule,
              nextQueries: { namespaced: true, ...nextQueriesXStoreModule } as AnyXStoreModule,
              querySuggestions: {
                namespaced: true,
                ...querySuggestionsXStoreModule
              } as AnyXStoreModule,
              relatedTags: { namespaced: true, ...relatedTagsXStoreModule } as AnyXStoreModule,
              search: { namespaced: true, ...searchXStoreModule } as AnyXStoreModule,
              facets: { namespaced: true, ...facetsXStoreModule } as AnyXStoreModule,
              historyQueries: {
                namespaced: true,
                ...historyQueriesXStoreModule
              } as AnyXStoreModule,
              identifierResults: {
                namespaced: true,
                ...identifierResultsXStoreModule
              } as AnyXStoreModule,
              popularSearches: {
                namespaced: true,
                ...popularSearchesXStoreModule
              } as AnyXStoreModule,
              recommendations: {
                namespaced: true,
                ...recommendationsXStoreModule
              } as AnyXStoreModule
            }
          : {}
      }
    }
  });

  const wrapper = mount(testComponent, {
    global: { plugins: [installNewXPlugin(), store] }
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
  it('returns default values when no module is registered', () => {
    const { xAliasAPI } = renderUseAliasApiTest(false);

    const defaultValues = {
      query: {
        facets: '',
        searchBox: '',
        nextQueries: '',
        querySuggestions: '',
        relatedTags: '',
        search: ''
      },
      status: {
        identifierResults: undefined,
        nextQueries: undefined,
        popularSearches: undefined,
        querySuggestions: undefined,
        recommendations: undefined,
        relatedTags: undefined,
        search: undefined
      },
      device: null,
      facets: {},
      historyQueries: [],
      historyQueriesWithResults: [],
      fullHistoryQueries: [],
      isHistoryQueriesEnabled: false,
      fromNoResultsWithFilters: false,
      identifierResults: [],
      searchBoxStatus: undefined,
      isEmpathizeOpen: false,
      nextQueries: [],
      noResults: false,
      partialResults: [],
      popularSearches: [],
      querySuggestions: [],
      fullQuerySuggestions: [],
      recommendations: [],
      redirections: [],
      relatedTags: [],
      results: [],
      scroll: {},
      selectedFilters: [],
      selectedRelatedTags: [],
      semanticQueries: [],
      spellcheckedQuery: null,
      totalResults: 0,
      selectedSort: ''
    };
    expect(xAliasAPI).toMatchObject(defaultValues);
  });
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
  it('reacts dynamically to referenced values changing', () => {
    const { store, xAliasAPI } = renderUseAliasApiTest();
    expect(xAliasAPI.historyQueries[0]).toBeUndefined();

    store.dispatch('x/historyQueries/addQueryToHistory', 'chorizo');

    expect(xAliasAPI.historyQueries[0].query).toEqual('chorizo');
  });
  it('has every property defined as a getter', () => {
    const { xAliasAPI } = renderUseAliasApiTest();
    /**
     * Checks that every property defined by the object and keys is a getter or an object that
     * only contains getters.
     *
     * @param obj - The object to check.
     * @param keys - The subset of keys from the object to check.
     * @returns True when the object properties defined by the keys are getters or object with
     * getters.
     */
    function isJSGetterOrDictionaryOfJSGetters(
      // object and string[] are the parameters used by getOwnPropertyDescriptor.
      // eslint-disable-next-line @typescript-eslint/ban-types
      obj: object,
      keys: string[]
    ): boolean {
      return keys.every(key => {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        const value = obj[key as keyof typeof obj];
        return (
          (descriptor?.set === undefined &&
            descriptor?.value === undefined &&
            descriptor?.get !== undefined) ||
          (typeof value === 'object' &&
            isJSGetterOrDictionaryOfJSGetters(value, Object.keys(value)))
        );
      });
    }

    const aliasKeys = Object.keys(xAliasAPI);

    expect(isJSGetterOrDictionaryOfJSGetters(xAliasAPI, aliasKeys)).toEqual(true);
  });
});

type renderUseAliasApiTestAPI = {
  store: Store<any>;
  wrapper: VueWrapper;
  query: UseAliasQueryAPI;
  status: UseAliasStatusAPI;
  xAliasAPI: UseAliasAPI;
};
