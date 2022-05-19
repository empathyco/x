import { QuerySuggestionsRequest, Suggestion } from '@empathyco/x-types';
import { map } from '@empathyco/x-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { normalizeString } from '../../../../utils';
import { getQuerySuggestionsStub } from '../../../../__stubs__/query-suggestions-stubs.factory';
import { querySuggestionsXStoreModule } from '../module';
import { QuerySuggestionsState } from '../types';
import { resetQuerySuggestionsStateWith } from './utils';

describe('testing query suggestions module getters', () => {
  Vue.use(Vuex);
  const getters = map(querySuggestionsXStoreModule.getters, getter => getter);
  const store: Store<QuerySuggestionsState> = new Store(querySuggestionsXStoreModule as any);
  beforeEach(() => {
    resetQuerySuggestionsStateWith(store);
  });

  describe(`${getters.request} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetQuerySuggestionsStateWith(store, { query: 'dorito', params: { catalog: 'es' } });
      expect(store.getters[getters.request]).toEqual<QuerySuggestionsRequest>({
        query: 'dorito',
        rows: 10,
        start: 0,
        extraParams: {
          catalog: 'es'
        }
      });
    });

    it('should return null when there is not query', () => {
      expect(store.getters[getters.request]).toBeNull();
    });

    it('should return null when there is an empty query', () => {
      resetQuerySuggestionsStateWith(store, { query: ' ' });
      expect(store.getters[getters.request]).toBeNull();
    });
  });

  describe(`${getters.normalizedQuery} getter`, () => {
    it('should return a normalized query', () => {
      const queries = ['espaÑita', 'aZúcaR', ' coraZón', 'baRça '];
      const normalizedQueries = ['espanita', 'azucar', 'corazon', 'barca'];

      queries.forEach((query, index) => {
        resetQuerySuggestionsStateWith(store, { query });
        expect(store.getters[getters.normalizedQuery]).toEqual(normalizedQueries[index]);
      });
    });
  });

  describe(`${getters.querySuggestions} getter`, () => {
    it(
      'should show the queries have to be equal to or contain the current query when ' +
        'hideIfEqualsQuery is false',
      () => {
        const querySearch = 'limes';
        const suggestionsStub = getQuerySuggestionsStub(querySearch);
        resetQuerySuggestionsStateWith(store, {
          config: { hideIfEqualsQuery: false },
          suggestions: suggestionsStub,
          query: querySearch
        });

        const gettersQuerySuggestions: Suggestion[] = store.getters[getters.querySuggestions];

        expect(gettersQuerySuggestions).toHaveLength(suggestionsStub.length);
      }
    );

    it(
      'should hide queries that are equal to the current query after normalizing special ' +
        'characters or have not facets and hideIfEqualsQuery is true',
      () => {
        const querySearch = 'limés';
        const suggestionsStub = getQuerySuggestionsStub(querySearch);
        resetQuerySuggestionsStateWith(store, {
          config: { hideIfEqualsQuery: true },
          suggestions: suggestionsStub,
          query: querySearch
        });

        const suggestionsStubFilterFacets = suggestionsStub.filter(
          (suggestion: Suggestion) =>
            // eslint-disable-next-line max-len
            // TODO Hide the suggestion if it's equals to the query and it does NOT have facets. (EX-3184)
            // The logic it's here https://bitbucket.org/colbenson/x-components/pull-requests/432
            // normalizedSuggestionQuery !== normalizedQuery || !isArrayEmpty(suggestion.facets)
            normalizeString(suggestion.query) !== normalizeString(querySearch)
        );

        const gettersQuerySuggestions: Suggestion[] = store.getters[getters.querySuggestions];
        expect(gettersQuerySuggestions).toHaveLength(suggestionsStubFilterFacets.length);
      }
    );

    it(
      'should show all queries when the query is similar with the query suggestions ' +
        'and hideIfEqualsQuery is true',
      () => {
        const querySearch = 'limes';
        const suggestionsStub = getQuerySuggestionsStub(querySearch);
        resetQuerySuggestionsStateWith(store, {
          config: { hideIfEqualsQuery: true },
          suggestions: suggestionsStub,
          query: 'lims'
        });

        const gettersQuerySuggestions: Suggestion[] = store.getters[getters.querySuggestions];

        expect(gettersQuerySuggestions).toHaveLength(suggestionsStub.length);
      }
    );
  });
});
