import { mount, shallowMount, Wrapper } from '@vue/test-utils';
import { ComponentOptions, default as Vue } from 'vue';
import { Store } from 'vuex';
import { installNewXPlugin } from '../../__tests__/utils';
import { xComponentMixin } from '../../components/x-component.mixin';
import { identifierResultsXModule } from '../../x-modules/identifier-results/x-module';
import { facetsXModule } from '../../x-modules/facets/x-module';
import { nextQueriesXModule } from '../../x-modules/next-queries/x-module';
import { popularSearchesXModule } from '../../x-modules/popular-searches/x-module';
import { querySuggestionsXModule } from '../../x-modules/query-suggestions/x-module';
import { recommendationsXModule } from '../../x-modules/recommendations/x-module';
import { relatedTagsXModule } from '../../x-modules/related-tags/x-module';
import { searchBoxXModule } from '../../x-modules/search-box/x-module';
import { searchXModule } from '../../x-modules/search/x-module';
import { XPlugin } from '../x-plugin';
import { getAliasAPI } from '../x-plugin.mixin';
import { XComponentAliasAPI } from '../x-plugin.types';
import getOwnPropertyDescriptor = Reflect.getOwnPropertyDescriptor;

describe('testing $x component API global mixin', () => {
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

  it('allows emitting and subscribing to events via $x object', () => {
    const listener = jest.fn();

    componentInstance.vm.$x.on('UserIsTypingAQuery').subscribe(listener);
    componentInstance.vm.$x.emit('UserIsTypingAQuery', 'So awesome, much quality, such skill');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('So awesome, much quality, such skill');
  });

  it('emits the event metadata', () => {
    const listener = jest.fn();
    const testTarget = document.createElement('div');

    const emitterComponent: ComponentOptions<any> & ThisType<Vue> = {
      mounted() {
        this.$x.emit('UserIsTypingAQuery', 'Sexy Lego', { target: testTarget });
      },
      render(createElement) {
        return createElement('input');
      }
    };

    mount(
      {
        mixins: [xComponentMixin(searchBoxXModule)],
        created() {
          this.$x.on('UserIsTypingAQuery', true).subscribe(listener);
        },
        render(createElement) {
          return createElement(emitterComponent);
        }
      } as ComponentOptions<any> & ThisType<Vue>,
      { localVue }
    );

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: 'Sexy Lego',
      metadata: { moduleName: 'searchBox', target: testTarget }
    });
  });

  it('smart components emits the event metadata', () => {
    const listener = jest.fn();
    const testTarget = document.createElement('div');
    mount(
      {
        mixins: [xComponentMixin(searchBoxXModule)],
        created() {
          this.$x.on('UserIsTypingAQuery', true).subscribe(listener);
        },
        mounted() {
          this.$x.emit('UserIsTypingAQuery', 'Sexy Lego', { target: testTarget });
        },
        render(createElement) {
          return createElement('input');
        }
      } as ComponentOptions<any> & ThisType<Vue>,
      { localVue }
    );
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: 'Sexy Lego',
      metadata: { moduleName: 'searchBox', target: testTarget }
    });
  });

  it('finds the root x-component and emits the bus events as Vue events', () => {
    const listener = jest.fn();
    const emitterComponent: ComponentOptions<any> & ThisType<Vue> = {
      mixins: [xComponentMixin(searchBoxXModule)], // Flag it as x-component
      mounted() {
        this.$x.emit('UserIsTypingAQuery', 'Sexy Playmobil');
      },
      render(createElement) {
        return createElement('input');
      }
    };

    const parentComponent: ComponentOptions<any> & ThisType<Vue> = {
      mixins: [xComponentMixin(searchBoxXModule)], // Flag it as x-component
      render(createElement) {
        return createElement(emitterComponent);
      }
    };

    mount(
      {
        render(createElement) {
          return createElement(parentComponent, {
            on: {
              UserIsTypingAQuery: listener
            }
          });
        }
      },
      { localVue }
    );

    expect(listener).toHaveBeenCalledTimes(1);
  });

  describe('testing alias', () => {
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
        nextQueries: [],
        popularSearches: [],
        historyQueries: [],
        querySuggestions: [],
        relatedTags: [],
        selectedRelatedTags: [],
        identifierResults: [],
        recommendations: [],
        facets: {},
        selectedFilters: []
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
      const REQUEST_STATUS_REGEX = /success|loading|error/;

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
          const descriptor = getOwnPropertyDescriptor(obj, key);
          const value = obj[key as keyof typeof obj];
          return (
            (descriptor?.set === undefined && descriptor?.value === undefined) ||
            (typeof value === 'object' &&
              isJSGetterOrDictionaryOfJSGetters(value, Object.keys(value)))
          );
        });
      }

      const aliasKeys = Object.keys(getAliasAPI(new Store({ state: { x: {} } })));

      expect(isJSGetterOrDictionaryOfJSGetters(componentInstance.vm.$x, aliasKeys)).toEqual(true);
    });
  });
});
