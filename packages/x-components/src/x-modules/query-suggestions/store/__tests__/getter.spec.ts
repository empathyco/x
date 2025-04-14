import type { QuerySuggestionsRequest, Suggestion } from '@empathyco/x-types'
import type { QuerySuggestionsState } from '../types'
import { map } from '@empathyco/x-utils'
import { Store } from 'vuex'
import { createHistoryQuery } from '../../../../__stubs__/history-queries-stubs.factory'
import { getQuerySuggestionsStub } from '../../../../__stubs__/query-suggestions-stubs.factory'
import { normalizeString } from '../../../../utils'
import { querySuggestionsXStoreModule } from '../module'
import { resetQuerySuggestionsStateWith } from './utils'

describe('testing query suggestions module getters', () => {
  const getters = map(querySuggestionsXStoreModule.getters, getter => getter)
  const store: Store<QuerySuggestionsState> = new Store(querySuggestionsXStoreModule as any)
  beforeEach(() => {
    resetQuerySuggestionsStateWith(store)
  })

  describe(`${getters.request} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetQuerySuggestionsStateWith(store, { query: 'dorito', params: { catalog: 'es' } })
      expect(store.getters[getters.request]).toEqual<QuerySuggestionsRequest>({
        query: 'dorito',
        rows: 10,
        start: 0,
        extraParams: {
          catalog: 'es',
        },
      })
    })

    it('should return null when there is not query', () => {
      expect(store.getters[getters.request]).toBeNull()
    })

    it('should return null when there is an empty query', () => {
      resetQuerySuggestionsStateWith(store, { query: ' ' })
      expect(store.getters[getters.request]).toBeNull()
    })
  })

  describe(`${getters.normalizedQuery} getter`, () => {
    it('should return a normalized query', () => {
      const queries = ['espaÑita', 'aZúcaR', ' coraZón', 'baRça ']
      const normalizedQueries = ['espanita', 'azucar', 'corazon', 'barca']

      queries.forEach((query, index) => {
        resetQuerySuggestionsStateWith(store, { query })
        expect(store.getters[getters.normalizedQuery]).toEqual(normalizedQueries[index])
      })
    })
  })

  describe(`${getters.querySuggestions} getter`, () => {
    it(
      'should show the queries have to be equal to or contain the current query when ' +
        'hideIfEqualsQuery is false',
      () => {
        const querySearch = 'limes'
        const suggestionsStub = getQuerySuggestionsStub(querySearch)
        resetQuerySuggestionsStateWith(store, {
          config: { hideIfEqualsQuery: false },
          suggestions: suggestionsStub,
          query: querySearch,
        })

        const gettersQuerySuggestions: Suggestion[] = store.getters[getters.querySuggestions]

        expect(gettersQuerySuggestions).toHaveLength(suggestionsStub.length)
      },
    )

    it(
      'should hide queries that are equal to the current query after normalizing special ' +
        'characters or have not facets and hideIfEqualsQuery is true',
      () => {
        const querySearch = 'limés'
        const suggestionsStub = getQuerySuggestionsStub(querySearch)
        resetQuerySuggestionsStateWith(store, {
          config: { hideIfEqualsQuery: true },
          suggestions: suggestionsStub,
          query: querySearch,
        })

        const suggestionsStubFilterFacets = suggestionsStub.filter(
          (suggestion: Suggestion) =>
            // TODO Hide the suggestion if it's equals to the query and it does NOT have facets. (EX-3184)
            // The logic it's here https://bitbucket.org/colbenson/x-components/pull-requests/432
            // normalizedSuggestionQuery !== normalizedQuery || !isArrayEmpty(suggestion.facets)
            normalizeString(suggestion.query) !== normalizeString(querySearch),
        )

        const gettersQuerySuggestions: Suggestion[] = store.getters[getters.querySuggestions]
        expect(gettersQuerySuggestions).toHaveLength(suggestionsStubFilterFacets.length)
      },
    )

    it(
      'should show all queries when the query is similar with the query suggestions ' +
        'and hideIfEqualsQuery is true',
      () => {
        const querySearch = 'limes'
        const suggestionsStub = getQuerySuggestionsStub(querySearch)
        resetQuerySuggestionsStateWith(store, {
          config: { hideIfEqualsQuery: true },
          suggestions: suggestionsStub,
          query: 'lims',
        })

        const gettersQuerySuggestions: Suggestion[] = store.getters[getters.querySuggestions]

        expect(gettersQuerySuggestions).toHaveLength(suggestionsStub.length)
      },
    )

    it('should hide queries that are equal to any history query and hideSessionQueries is true', () => {
      const querySearch = 'dress'
      const suggestionsStub = getQuerySuggestionsStub(querySearch)
      const historyQueriesStub = createHistoryQuery({ query: 'dress suggestion 1' })
      resetQuerySuggestionsStateWith(store, {
        config: { hideSessionQueries: true },
        suggestions: suggestionsStub,
        searchedQueries: [historyQueriesStub],
        query: querySearch,
      })

      const gettersQuerySuggestions: Suggestion[] = store.getters[getters.querySuggestions]

      const queriesSuggested = gettersQuerySuggestions.map(
        (suggestion: Suggestion) => suggestion.query,
      )

      expect(gettersQuerySuggestions).toHaveLength(suggestionsStub.length - 1)
      expect(queriesSuggested).toEqual(['dress suggestion 0', 'dress suggestion 2'])
    })

    it('should show all suggestions when hideSessionQueries is false', () => {
      const querySearch = 'dress'
      const suggestionsStub = getQuerySuggestionsStub(querySearch)
      const historyQueriesStub = createHistoryQuery({ query: 'dress suggestion 1' })
      resetQuerySuggestionsStateWith(store, {
        config: { hideSessionQueries: false },
        suggestions: suggestionsStub,
        searchedQueries: [historyQueriesStub],
        query: querySearch,
      })

      const gettersQuerySuggestions: Suggestion[] = store.getters[getters.querySuggestions]

      expect(gettersQuerySuggestions).toHaveLength(suggestionsStub.length)
    })
  })
})
