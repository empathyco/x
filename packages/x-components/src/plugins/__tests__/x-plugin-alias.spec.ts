import { shallowMount, Wrapper } from '@vue/test-utils';
import { ComponentOptions, default as Vue } from 'vue';
import { installNewXPlugin } from '../../__tests__/utils';
import { identifierResultsXModule } from '../../x-modules/identifier-results/x-module';
import { nextQueriesXModule } from '../../x-modules/next-queries/x-module';
import { popularSearchesXModule } from '../../x-modules/popular-searches/x-module';
import { querySuggestionsXModule } from '../../x-modules/query-suggestions/x-module';
import { recommendationsXModule } from '../../x-modules/recommendations/x-module';
import { relatedTagsXModule } from '../../x-modules/related-tags/x-module';
import { searchXModule } from '../../x-modules/search/x-module';
import { searchBoxXModule } from '../../x-modules/search-box/x-module';
import { XPlugin } from '../x-plugin';
import { getAliasAPI } from '../x-plugin.alias';
import { XComponentAliasAPI } from '../x-plugin.types';
import { facetsXModule } from '../../x-modules/facets/index';

describe('testing plugin alias', () => {
  const component: ComponentOptions<Vue> & ThisType<Vue> = {
    render(createElement) {
      return createElement();
    }
  };

  let localVue: typeof Vue;
  let componentInstance: Wrapper<Vue>;

  beforeEach(() => {
    [, localVue] = installNewXPlugin();
    componentInstance = shallowMount(component, { localVue });
  });

  afterEach(() => {
    componentInstance.destroy();
    jest.clearAllMocks();
  });

  it('returns default values when no module is registered', () => {
    const defaultValues: XComponentAliasAPI = {
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
      fullHistoryQueries: [],
      identifierResults: [],
      isEmpathizeOpen: false,
      nextQueries: [],
      noResults: false,
      partialResults: [],
      popularSearches: [],
      querySuggestions: [],
      recommendations: [],
      redirections: [],
      relatedTags: [],
      results: [],
      scroll: {},
      selectedFilters: [],
      selectedRelatedTags: [],
      spellcheckedQuery: null,
      totalResults: 0,
      selectedSort: ''
    };
    expect(componentInstance.vm.$x).toMatchObject(defaultValues);
  });

  it('updates the query values when the module is registered', () => {
    XPlugin.registerXModule(nextQueriesXModule);
    XPlugin.registerXModule(querySuggestionsXModule);
    XPlugin.registerXModule(relatedTagsXModule);
    XPlugin.registerXModule(searchBoxXModule);
    XPlugin.registerXModule(searchXModule);
    XPlugin.registerXModule(facetsXModule);

    componentInstance.vm.$store.commit('x/searchBox/setQuery', 'this');
    componentInstance.vm.$store.commit('x/nextQueries/setQuery', 'is');
    componentInstance.vm.$store.commit('x/querySuggestions/setQuery', 'working');
    componentInstance.vm.$store.commit('x/relatedTags/setQuery', 'properly');
    componentInstance.vm.$store.commit('x/search/setQuery', 'nice');
    componentInstance.vm.$store.commit('x/facets/setQuery', '!');

    expect(componentInstance.vm.$x.query).toEqual({
      searchBox: 'this',
      nextQueries: 'is',
      querySuggestions: 'working',
      relatedTags: 'properly',
      search: 'nice',
      facets: '!'
    });
  });

  it('updates the status values when the module is registered', () => {
    const REQUEST_STATUS_REGEX = /success|loading|error|initial/;

    XPlugin.registerXModule(identifierResultsXModule);
    XPlugin.registerXModule(popularSearchesXModule);
    XPlugin.registerXModule(recommendationsXModule);

    expect(componentInstance.vm.$x.status).toEqual({
      identifierResults: expect.stringMatching(REQUEST_STATUS_REGEX),
      popularSearches: expect.stringMatching(REQUEST_STATUS_REGEX),
      recommendations: expect.stringMatching(REQUEST_STATUS_REGEX)
    });

    XPlugin.registerXModule(nextQueriesXModule);
    XPlugin.registerXModule(querySuggestionsXModule);
    XPlugin.registerXModule(relatedTagsXModule);
    XPlugin.registerXModule(searchBoxXModule);
    XPlugin.registerXModule(searchXModule);

    expect(componentInstance.vm.$x.status).toEqual({
      identifierResults: expect.stringMatching(REQUEST_STATUS_REGEX),
      popularSearches: expect.stringMatching(REQUEST_STATUS_REGEX),
      recommendations: expect.stringMatching(REQUEST_STATUS_REGEX),
      nextQueries: expect.stringMatching(REQUEST_STATUS_REGEX),
      querySuggestions: expect.stringMatching(REQUEST_STATUS_REGEX),
      relatedTags: expect.stringMatching(REQUEST_STATUS_REGEX),
      search: expect.stringMatching(REQUEST_STATUS_REGEX)
    });
  });

  it('has every property defined as a getter', () => {
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

    const aliasKeys = Object.keys(getAliasAPI(componentInstance.vm));

    expect(isJSGetterOrDictionaryOfJSGetters(componentInstance.vm.$x, aliasKeys)).toEqual(true);
  });
});
